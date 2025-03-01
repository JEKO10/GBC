import GooglePayButton from "@google-pay/button-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { createPaymentIntent } from "@/actions/stripeActions";

interface GoogleButtonProps {
  items: { [key: string]: number };
  menu?: {
    id: number;
    title: string;
    restaurant_id: number;
    category: string | null;
    price: number;
    description: string | null;
  }[];
  orderNote: string;
  finalTotal: number;
}

const GoogleButton = ({
  items,
  menu,
  orderNote,
  finalTotal,
}: GoogleButtonProps) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const router = useRouter();

  const handlePayment = async (
    paymentData: google.payments.api.PaymentData
  ) => {
    try {
      const token = paymentData.paymentMethodData.tokenizationData.token;
      const restaurantId = menu?.[0]?.restaurant_id || 0;

      const orderedItems = Object.entries(items)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, quantity]) => quantity > 0)
        .map(([title, quantity]) => ({
          title,
          quantity,
          price: menu?.find((item) => item.title === title)?.price || 0,
        }));

      const response = await createPaymentIntent(
        finalTotal,
        token,
        orderedItems,
        restaurantId,
        orderNote
      );

      if (response.clientSecret) {
        setErrorMessage("Success! Redirecting you...");
        router.push(`/profile/orders`);
        localStorage.setItem("basketItems", JSON.stringify({}));
      } else if (response.error) {
        setErrorMessage(response.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <article>
      <GooglePayButton
        environment="TEST" // @TODO prodution
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          shippingAddressRequired: true,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["MASTERCARD", "VISA"],
              },
              tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: {
                  gateway: "stripe",
                  "stripe:version": "2018-10-31",
                  "stripe:publishableKey":
                    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID || "", // @TODO change it
            merchantName: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_NAME || "", // @TODO change it
          },
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: "Total",
            totalPrice: `${finalTotal}`,
            currencyCode: "GBP",
            countryCode: "GB",
          },
        }}
        onLoadPaymentData={(paymentRequest) => handlePayment(paymentRequest)}
        buttonColor="white"
        existingPaymentMethodRequired={false}
      />
      {/* @TODO succes i error */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </article>
  );
};

export default GoogleButton;
