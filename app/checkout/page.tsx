"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import GoogleButton from "@/components/Restaurant/GooglePayButton";
import { calculateFees } from "@/lib/calculateFees";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { useUserLocationStore } from "@/store/useUserLocationStore";

const Map = dynamic(() => import("@/components/Restaurant/UserLocationMap"), {
  ssr: false,
  loading: () => <div className="map-loader" />,
});

const CheckoutPage = () => {
  const { items, note, total, menu } = useCheckoutStore();
  const router = useRouter();
  const { coords, address } = useUserLocationStore();
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const shouldRedirectToMap = useCallback(() => {
    return (
      pathname === "/checkout" &&
      items.length === 0 &&
      menu.length === 0 &&
      typeof window !== "undefined"
    );
  }, [pathname, items, menu]);

  useEffect(() => {
    if (hydrated && shouldRedirectToMap()) {
      const timer = setTimeout(() => {
        router.replace("/map");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [hydrated, shouldRedirectToMap, router]);

  const menuLookup = useMemo(() => {
    return menu.reduce(
      (acc, item) => {
        acc[item.id] = item;
        return acc;
      },
      {} as Record<number, (typeof menu)[0]>
    );
  }, [menu]);

  const { deliveryFee, serviceFee, vat, finalTotal } = calculateFees(total);

  if (!hydrated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-outfit">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        {items.map(({ id, quantity }) => {
          const item = menuLookup[id];
          if (!item) return null;

          return (
            <div
              key={id}
              className="flex items-center gap-4 bg-primary p-4 rounded shadow"
            >
              {item.imageUrl ? (
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    src={`/menus/${item.imageUrl}`}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded" />
              )}
              <div className="flex-1">
                <p className="text-white font-semibold text-lg">{item.title}</p>
                <p className="text-sm text-secondary">
                  {quantity} × £{item.price.toFixed(2)}
                </p>
              </div>
              <p className="text-lg text-secondary font-semibold">
                £{(item.price * quantity).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-2 text-sm text-gray-700 border-t pt-4">
        <p>
          Total Items:
          <span className="float-right">
            {items.reduce((a, b) => a + b.quantity, 0)}
          </span>
        </p>
        <p>
          Subtotal: <span className="float-right">£{total.toFixed(2)}</span>
        </p>
        <p>
          Delivery Fee: <span className="float-right">£{deliveryFee}</span>
        </p>
        <p>
          Service Fee: <span className="float-right">£{serviceFee}</span>
        </p>
        <p>
          VAT (20%): <span className="float-right">£{vat}</span>
        </p>
        <p className="text-lg font-semibold border-t pt-2">
          Final Total: <span className="float-right">£{finalTotal}</span>
        </p>
      </div>

      {note && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Order Note:</h3>
          <p className="bg-gray-100 p-3 rounded text-sm text-gray-700">
            {note}
          </p>
        </div>
      )}

      {coords && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Your Delivery address:</h3>
          <p>{address}</p>

          <Map userCoords={coords} />
          <p className="mt-2">
            If you want it delivered somewhere else, come back to
            <Link href="/map" className="text-secondary hover:text-primary">
              {" "}
              MAP{" "}
            </Link>
            and enter your full delivery location :)
          </p>
        </div>
      )}

      <div className="mt-10 text-center">
        <GoogleButton
          items={items}
          menu={menu}
          orderNote={note}
          finalTotal={finalTotal}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
