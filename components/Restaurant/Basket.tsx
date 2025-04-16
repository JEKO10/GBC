import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { GrBasket } from "react-icons/gr";

interface BasketProps {
  items: { [key: string]: number };
  menu?: {
    id: number;
    title: string;
    restaurant_id: number;
    category: string | null;
    price: number;
    description: string | null;
    imageUrl: string | null;
  }[];
  // eslint-disable-next-line no-unused-vars
  handleQuantityChange: (itemName: string, quantity: number) => void;
}

import { calculateFees } from "@/lib/calculateFees";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const Basket = ({ items, menu, handleQuantityChange }: BasketProps) => {
  const [orderNote, setOrderNote] = useState("");
  const router = useRouter();
  const setCheckoutData = useCheckoutStore((state) => state.setCheckoutData);

  const menuLookup = useMemo(() => {
    return (
      menu?.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<number, (typeof menu)[0]>
      ) || {}
    );
  }, [menu]);

  const orderedItems = useMemo(() => {
    return Object.entries(items).reduce(
      (acc, [title, quantity]) => {
        const menuItem = menu?.find((item) => item.title === title);
        if (menuItem) {
          acc.push({ id: menuItem.id, quantity });
        }
        return acc;
      },
      [] as { id: number; quantity: number }[]
    );
  }, [items, menu]);

  const totalPrice = useMemo(() => {
    return parseFloat(
      orderedItems
        .reduce((acc, { id, quantity }) => {
          const menuItem = menuLookup[id];
          return acc + (menuItem?.price || 0) * quantity;
        }, 0)
        .toFixed(2)
    );
  }, [orderedItems, menuLookup]);

  const { deliveryFee, serviceFee, vat, finalTotal } =
    calculateFees(totalPrice);

  const totalItems = useMemo(() => {
    return orderedItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [orderedItems]);

  if (Object.keys(items).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10">
        <GrBasket className="text-6xl mb-6 text-gray-400" />
        <h3 className="text-2xl font-semibold">Your basket is empty</h3>
        <p className="text-gray-600 mt-2">Add some items to place an order.</p>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    setCheckoutData({
      items: orderedItems,
      note: orderNote,
      total: totalPrice,
      menu: menu || [],
    });

    document.body.style.overflow = "auto";

    router.push("/checkout");
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Your Basket</h2>

      <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2">
        {Object.entries(items).map(([name, quantity]) => {
          const menuItem = menu?.find((item) => item.title === name);
          if (!menuItem) return null;

          return (
            <div
              key={name}
              className="flex items-center gap-4 bg-gray-50 p-3 rounded-md shadow-sm"
            >
              {menuItem.imageUrl ? (
                <div className="hidden sm:block w-16 h-16 rounded-md overflow-hidden relative flex-shrink-0">
                  <Image
                    src={`/menus/${menuItem.imageUrl}`}
                    alt={`Image of ${name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0" />
              )}

              <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-500">
                  £{menuItem.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(name, -1)}
                  className="bg-red-100 text-red-600 px-2 rounded-full select-none"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(name, 1)}
                  className="bg-green-100 text-green-600 px-2 rounded-full select-none"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-1">
        <p>
          Total Items: <span className="float-right">{totalItems}</span>
        </p>
        <p>
          Total Price: <span className="float-right">£{totalPrice}</span>
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
        <p className="font-semibold text-base pt-2 border-t">
          Final Price: <span className="float-right">£{finalTotal}</span>
        </p>
      </div>

      <textarea
        className="w-full max-h-20 mt-4 p-3 border border-gray-300 rounded-md"
        placeholder="Add a note for the restaurant..."
        value={orderNote}
        onChange={(e) => setOrderNote(e.target.value)}
      />

      <div className="mt-6 text-center">
        {totalPrice > 8 ? (
          <button
            onClick={handleProceedToCheckout}
            className="bg-secondary text-white font-semibold px-6 py-3 rounded-full mt-4 w-full"
          >
            Proceed to Checkout
          </button>
        ) : (
          <p className="text-red-500 font-medium">Minimum order price is £8</p>
        )}
      </div>
    </section>
  );
};

export default Basket;
