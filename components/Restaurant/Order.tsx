"use client";

import Link from "next/link";
import { JsonValue } from "next-auth/adapters";
import React, { useCallback } from "react";
import { BiTrash } from "react-icons/bi";

import { OrderedItem } from "@/app/profile/orders/page";
import { deleteOrder } from "@/data/user";

interface OrderProps {
  order: {
    restaurant: {
      id: number;
      name: string;
    };
  } & {
    id: string;
    orderNumber: number;
    amount: number;
    status: string;
    stripeId: string;
    orderNote: string;
    createdAt: Date;
    userId: string;
    items: JsonValue;
    restaurantId: number;
  };
  orderedItems: OrderedItem[];
}

const Order = ({ order, orderedItems }: OrderProps) => {
  const removeOrder = useCallback(async (id: string) => {
    await deleteOrder(id);
  }, []);

  return (
    <div key={order.id} className="border-2 border-white rounded-md p-3 my-3">
      <p>
        <strong>Order ID:</strong> #{order.orderNumber}
      </p>
      <p>
        <strong>Amount:</strong> £{(order.amount / 100).toFixed(2)}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Payment ID:</strong> {order.stripeId}
      </p>
      <p>
        <strong>Order Note: </strong>
        {order.orderNote || "No note added."}
      </p>
      <p>
        <strong>Created At: </strong>
        {new Date(order.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Estimated delivery time: </strong>
        {new Date(
          new Date(order.createdAt).getTime() + 45 * 60 * 1000
        ).toLocaleString()}
      </p>
      <p>
        <strong>Restaurant: </strong>
        <Link
          // @TODO islo je na ID sad mora na decoded name
          href={`/restaurants/${order.restaurant.name}`}
          className="text-blue-500"
        >
          {order.restaurant?.name || "Unknown Restaurant"}
        </Link>
      </p>
      <h2>Ordered Items</h2>
      {Array.isArray(orderedItems) ? (
        orderedItems.map((item, index) => (
          <div
            key={index}
            className="border-2 border-white rounded-md p-3 my-3"
          >
            <p>
              <strong>{item?.title}</strong> x{item?.quantity} - £{item?.price}
            </p>
          </div>
        ))
      ) : (
        <p>No items found.</p>
      )}
      <button
        type="submit"
        className="cursor-pointer text-red-600 text-3xl"
        onClick={() => removeOrder(order.id)}
      >
        <BiTrash />
      </button>
    </div>
  );
};

export default Order;
