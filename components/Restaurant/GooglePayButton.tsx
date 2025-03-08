import GooglePayButton from "@google-pay/button-react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { setUserGoogleAddress, setUserPhoneNumber } from "@/actions/settings";
import { createPaymentIntent } from "@/actions/stripeActions";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

// @TODO .toFixed(2)
const GoogleButton = ({
  items,
  menu,
  orderNote,
  finalTotal,
}: GoogleButtonProps) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const user = useCurrentUser();

  const handlePayment = async (
    paymentData: google.payments.api.PaymentData
  ) => {
    setLoading(true);
    setErrorMessage("");

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

      const googlePayAddress = paymentData.shippingAddress;

      if (googlePayAddress && !user?.phone) {
        await setUserPhoneNumber(googlePayAddress.phoneNumber);
      }

      if (googlePayAddress && !user?.address) {
        await setUserGoogleAddress(
          `${googlePayAddress.address1}, ${googlePayAddress.postalCode}`
        );
      }

      // @TODO check
      const response = await createPaymentIntent(
        finalTotal,
        token,
        orderedItems,
        restaurantId,
        orderNote
      );

      if (!response.clientSecret) {
        setErrorMessage(response.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      const stripeInstance = await stripePromise;
      const result = await stripeInstance?.confirmCardPayment(
        response.clientSecret
      );

      if (result?.paymentIntent?.status === "succeeded") {
        setErrorMessage("Payment successful! Redirecting...");
        localStorage.setItem("basketItems", JSON.stringify({}));
        setTimeout(() => {
          router.push(`/payment-success`);
        }, 1500);
      } else if (result?.error) {
        setErrorMessage(result.error.message || "Payment failed. Try again.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
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
          shippingAddressParameters: {
            phoneNumberRequired: true,
          },
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX"],
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
            merchantId: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID || "",
            merchantName: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_NAME || "",
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
        buttonColor="black"
        existingPaymentMethodRequired={false}
      />
      {/* @TODO succes i error */}
      {loading && <p className="text-blue-500 mt-2">Processing payment...</p>}
      {errorMessage && (
        <p
          className={`mt-2 ${errorMessage.includes("successful") ? "text-green-500" : "text-red-500"}`}
        >
          {errorMessage}
        </p>
      )}
      {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
    </article>
  );
};

export default GoogleButton;
