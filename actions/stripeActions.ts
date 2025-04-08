"use server";

import Stripe from "stripe";

import { currentUser } from "@/lib/auth";
import { calculateFees } from "@/lib/calculateFees";
import db from "@/lib/db";
import { pusher } from "@/lib/pusher";

if (!process.env.STRIPE_SECRET) {
  console.log("Missing stripe secret variable!");
}

const stripe = new Stripe(process.env.STRIPE_SECRET || "");

function generateOrderId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// @TODO add paymentID func

export async function createPaymentIntent(
  paymentToken: string,
  items: {
    id: number;
    quantity: number;
  }[],
  restaurantId: number,
  orderNote: string
) {
  const parsedToken = JSON.parse(paymentToken);
  const orderId = generateOrderId();
  const user = await currentUser();

  if (!user) {
    return {
      error: true,
      message: "User does not exist!",
    };
  }

  try {
    const orderedItems = await Promise.all(
      items.map(async (item) => {
        if (!Number.isInteger(item.id)) {
          throw new Error(`Invalid item ID received: ${item.id}`);
        }

        const dbItem = await db.menu.findUnique({
          where: { id: item.id },
          select: { price: true, title: true },
        });

        if (!dbItem) {
          throw new Error(`Item ${item.id} not found in the database.`);
        }

        return {
          title: dbItem.title,
          quantity: item.quantity,
          price: dbItem.price.toNumber(),
        };
      })
    );

    const totalAmount = orderedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { finalTotal } = calculateFees(totalAmount);

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: parsedToken.id,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100),
      currency: "GBP",
      payment_method: paymentMethod.id,
      confirmation_method: "automatic",
      confirm: true,
      return_url: `https://www.gbcanteen.com/payment-success`,
      payment_method_options: {
        card: {
          request_three_d_secure: "any",
        },
      },
      metadata: {
        orderId: orderId.toString(),
        userId: user.id.toString(),
        phone: user.phone,
        restaurantId: restaurantId.toString(),
        orderNote: orderNote || "",
      },
      receipt_email: user.email || "",
    });

    if (
      paymentIntent.status === "requires_action" &&
      paymentIntent.next_action?.redirect_to_url
    ) {
      return {
        clientSecret: paymentIntent.client_secret,
        orderId,
        nextActionUrl: paymentIntent.next_action.redirect_to_url.url,
        orderedItems,
      };
    }

    return {
      clientSecret: paymentIntent.client_secret,
      orderId,
      message: paymentIntent.status,
      orderedItems,
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred. Please try again.";

    if (error instanceof Stripe.errors.StripeError) {
      switch (error.type) {
        case "StripeCardError":
          errorMessage = "Your card was declined. Try another card.";
          break;
        case "StripeInvalidRequestError":
          errorMessage = "Invalid request. Please check your payment details.";
          break;
        case "StripeAPIError":
          errorMessage = "Stripe's servers had an issue. Try again later.";
          break;
        case "StripeConnectionError":
          errorMessage = "Network error. Check your connection and try again.";
          break;
        case "StripeAuthenticationError":
          errorMessage = "Authentication with Stripe failed. Contact support.";
          break;
        default:
          errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      error: true,
      message: errorMessage,
    };
  }
}

export async function createOrder(
  paymentIntentId: string,
  orderedItems: { title: string; quantity: number; price: number }[] | undefined
) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return { error: true, message: "Payment not completed yet." };
    }

    if (!paymentIntent.metadata) {
      return { error: true, message: "Metadata is missing in payment intent." };
    }

    if (!Array.isArray(orderedItems) || orderedItems.length === 0) {
      return { error: true, message: "No ordered items provided." };
    }

    const orderId = Number(paymentIntent.metadata.orderId);
    const userId = paymentIntent.metadata.userId;
    const restaurantId = Number(paymentIntent.metadata.restaurantId);
    const orderNote = paymentIntent.metadata.orderNote || "";

    if (!Array.isArray(orderedItems)) {
      return { error: true, message: "Ordered items format is incorrect." };
    }

    const newOrder = await db.order.create({
      data: {
        orderNumber: orderId,
        amount: paymentIntent.amount,
        stripeId: paymentIntent.id,
        status: "pending",
        userId,
        restaurantId,
        orderNote,
        items: orderedItems,
      },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            address: true,
            googleAddress: true,
          },
        },
      },
    });

    const orderPayload = {
      id: newOrder.id,
      orderNumber: newOrder.orderNumber,
      stripeId: newOrder.stripeId,
      amount: newOrder.amount,
      status: newOrder.status,
      items: newOrder.items,
      createdAt: newOrder.createdAt,
      user: newOrder.user,
    };

    try {
      await pusher.trigger(`restaurant-${restaurantId}`, "new-order", {
        ...orderPayload,
        restaurantId,
      });
    } catch (err) {
      console.error("Pusher failed, so notify admin:", err);

      return {
        error: true,
        message:
          "Your order was saved but could not be sent to the restaurant!",
      };
    }

    return { success: true, orderId: newOrder.orderNumber };
  } catch {
    return {
      error: true,
      message: "Failed to verify payment or create order.",
    };
  }
}
