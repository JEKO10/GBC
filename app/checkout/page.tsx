"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import GoogleButton from "@/components/Restaurant/GooglePayButton";
import { calculateFees } from "@/lib/calculateFees";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const CheckoutPage = () => {
  const { items, note, total, menu } = useCheckoutStore();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0 || menu.length === 0) {
      router.replace("/map");
    }
  }, [items, menu, router]);

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
