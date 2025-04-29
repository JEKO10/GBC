"use server";

import { JsonValue } from "@prisma/client/runtime/library";
import Stripe from "stripe";

import { currentUser } from "@/lib/auth";
import { calculateFees } from "@/lib/calculateFees";
import db from "@/lib/db";
import { pusher } from "@/lib/pusher";

if (!process.env.STRIPE_SECRET) {
  console.log("Missing stripe secret variable!");
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: number;
  orderNote: string;
  amount: number;
  orderNumber: string;
  stripeId: string;
  createdAt: Date;
  status: string;
  items: JsonValue;
  user: {
    name: string;
    phone: string | null;
    address: string | null;
    googleAddress: string | null;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET || "");

function generateOrderId(restaurantId: number) {
  const random = Math.floor(Math.random() * 9000);
  const padded = String(random).padStart(4, "0");
  return `${restaurantId}-${padded}`;
}

function generatePaymentId(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.toUpperCase();
}

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
  const orderId = generateOrderId(restaurantId);
  const paymentId = generatePaymentId();
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
          request_three_d_secure: "automatic",
        },
      },
      metadata: {
        orderId,
        paymentId,
        userId: user.id,
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

    const orderId = paymentIntent.metadata.orderId;
    const paymentId = paymentIntent.metadata.paymentId;
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
        stripeId: paymentId,
        status: "Pending",
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

    await triggerPusherOrder(newOrder);

    return { success: true, newOrder };
  } catch {
    return {
      error: true,
      message: "Failed to verify payment or create order.",
    };
  }
}

export async function triggerPusherOrder(order: Order | undefined) {
  try {
    if (!order) {
      return {
        error: true,
        message: "No order to send!",
      };
    }

    const restaurantId = order.restaurantId;

    const payload = {
      id: order.id,
      orderNumber: order.orderNumber,
      stripeId: order.stripeId,
      amount: order.amount,
      status: order.status,
      items: order.items,
      createdAt: order.createdAt,
      user: order.user,
      restaurantId,
    };

    // setTimeout(async () => {
    await pusher.trigger(
      `restaurant-${String(restaurantId)}`,
      "new-order",
      payload
    );
    // }, 1000);

    return { success: true };
  } catch (err) {
    console.error("❌ Pusher trigger failed:", err);
    return {
      error: true,
      message: "Order saved but notification failed",
    };
  }
}
