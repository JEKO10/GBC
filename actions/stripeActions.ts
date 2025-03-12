"use server";

import Stripe from "stripe";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

if (!process.env.STRIPE_SECRET) {
  console.log("Missing stripe secret variable!");
}

const stripe = new Stripe(process.env.STRIPE_SECRET || "");

function generateOrderId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function createPaymentIntent(
  amount: number,
  paymentToken: string,
  items: {
    title: string;
    quantity: number;
    price: number;
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
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: parsedToken.id,
      },
    });

    // @TODO price reciving, front end or from db directyle
    const paymentIntent = await stripe.paymentIntents.create({
      // @TODO check this
      amount: Math.round(amount * 100),
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
        orderedItems: JSON.stringify(items),
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
      };
    }

    return {
      clientSecret: paymentIntent.client_secret,
      orderId,
      message: paymentIntent.status,
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

export async function createOrder(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return { error: true, message: "Payment not completed yet." };
    }

    if (!paymentIntent.metadata) {
      return { error: true, message: "Metadata is missing in payment intent." };
    }

    if (!paymentIntent.metadata.orderedItems) {
      return { error: true, message: "Ordered items not found in metadata." };
    }

    // @TODO metadata or front end for items
    const orderId = Number(paymentIntent.metadata.orderId);
    const userId = paymentIntent.metadata.userId;
    const restaurantId = Number(paymentIntent.metadata.restaurantId);
    const orderNote = paymentIntent.metadata.orderNote || "";
    const items = JSON.parse(paymentIntent.metadata.orderedItems);

    if (!Array.isArray(items)) {
      return { error: true, message: "Ordered items format is incorrect." };
    }

    const newOrder = await db.order.create({
      data: {
        orderNumber: Number(orderId),
        amount: paymentIntent.amount,
        stripeId: paymentIntent.id,
        status: "pending",
        userId,
        restaurantId,
        items,
        orderNote,
      },
    });

    return { success: true, orderId: newOrder.orderNumber };
  } catch {
    return {
      error: true,
      message: "Failed to verify payment or create order.",
    };
  }
}
