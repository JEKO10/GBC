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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "GBP",
      payment_method: paymentMethod.id,
      confirmation_method: "automatic",
      confirm: true,
      return_url: `http://www.localhost:3000/orders`, //@TODO change url
      metadata: {
        orderId: orderId.toString(),
        userId: user.id.toString(),
        restaurantId: restaurantId.toString(),
        orderNote: orderNote || "",
      },
    });

    await db.order.create({
      data: {
        orderNumber: Number(orderId),
        amount: amount * 100,
        stripeId: paymentIntent.id,
        status: "pending",
        userId: user.id,
        restaurantId,
        items,
        orderNote: orderNote || "",
      },
    });

    return { clientSecret: paymentIntent.client_secret, orderId };
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
