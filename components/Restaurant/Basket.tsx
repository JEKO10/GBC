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
  }[];
  // eslint-disable-next-line no-unused-vars
  handleQuantityChange: (itemName: string, quantity: number) => void;
}

import { calculateFees } from "@/lib/calculateFees";

import GoogleButton from "./GooglePayButton";

const Basket = ({ items, menu, handleQuantityChange }: BasketProps) => {
  const [orderNote, setOrderNote] = useState("");

  const menuLookup = useMemo(() => {
    return (
      menu?.reduce(
        (acc, item) => {
          acc[item.title.toLowerCase().trim()] = item;
          return acc;
        },
        {} as Record<string, { id: number; price: number }>
      ) || {}
    );
  }, [menu]);

  const orderedItems = useMemo(() => {
    return Object.entries(items).reduce(
      (acc, [title, quantity]) => {
        const menuItem = menuLookup[title.toLowerCase().trim()];
        if (menuItem) {
          acc.push({ id: menuItem.id, quantity });
        }
        return acc;
      },
      [] as { id: number; quantity: number }[]
    );
  }, [items, menuLookup]);

  const totalPrice = useMemo(() => {
    return parseFloat(
      Object.entries(items)
        .reduce((acc, [title, quantity]) => {
          const menuItem = menuLookup[title.toLowerCase().trim()];
          return acc + (menuItem?.price || 0) * quantity;
        }, 0)
        .toFixed(2)
    );
  }, [items, menuLookup]);

  const { deliveryFee, serviceFee, vat, finalTotal } =
    calculateFees(totalPrice);

  const totalItems = useMemo(() => {
    return orderedItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [orderedItems]);

  return (
    <section className="bg-white fixed top-0 right-0 h-full w-1/3 flex justify-center items-center shadow-2xl">
      <h3 className="absolute top-4 text-2xl font-bold">Basket</h3>
      {Object.keys(items).length === 0 ? (
        <div className="flex justify-center items-center flex-col">
          <GrBasket className="text-8xl" />
          <h3 className="text-3xl mt-10 font-bold">Fill your basket</h3>
          <p className="text-lg mt-2">Your basket is empty</p>
        </div>
      ) : (
        <div className="bg-white p-6 w-1/2 rounded-md shadow-md h-fit">
          <h3 className="text-xl font-bold mb-4">Basket</h3>
          {Object.entries(items).map(([name, quantity]) => (
            <div key={name} className="flex justify-between mb-2">
              <span>{name}</span>
              <div className="flex justify-center items-center gap-2">
                <button
                  className="text-xl"
                  onClick={() => handleQuantityChange(name, quantity - 1)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(name, quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <hr className="my-3" />
          <p className="font-semibold">Total Items: {totalItems}</p>
          <p className="font-semibold">Total Price: £{totalPrice}</p>
          <p className="font-semibold">Delivery Fee: £{deliveryFee}</p>
          <p className="font-semibold">Service Fee: £{serviceFee}</p>
          <p className="font-semibold">VAT (20%): £{vat}</p>
          <p className="font-semibold">Final Price: £{finalTotal}</p>
          <textarea
            className="w-full max-h-20 p-2 border rounded-md mt-4"
            placeholder="Add a note for the restaurant..."
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
          />
        </div>
      )}
      <div className="w-full absolute bottom-2 left-0 text-center">
        {totalPrice > 8 ? (
          <GoogleButton
            menu={menu}
            items={orderedItems}
            orderNote={orderNote}
            finalTotal={finalTotal}
          />
        ) : (
          <p>Minimum order price is 8£.</p>
        )}
      </div>
    </section>
  );
};

export default Basket;
