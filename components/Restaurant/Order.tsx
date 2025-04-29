"use client";

import Link from "next/link";
import { JsonValue } from "next-auth/adapters";
import React from "react";

import { OrderedItem } from "@/app/profile/orders/page";

interface OrderProps {
  order: {
    restaurant: {
      id: number;
      name: string;
    };
    id: string;
    orderNumber: string;
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
  return (
    <div className="border-2  border-secondary rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Order #{order.orderNumber.split("-").pop()}
          </h2>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full font-medium ${
            order.status === "Completed" || order.status === "Ready"
              ? "bg-green-100 text-green-700"
              : order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-800"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p>
          <strong>Total Amount:</strong> £{(order.amount / 100).toFixed(2)}
        </p>
        <p>
          <strong>Payment ID:</strong> {order.stripeId}
        </p>
        <p>
          <strong>Estimated Delivery:</strong>{" "}
          {new Date(
            new Date(order.createdAt).getTime() + 45 * 60 * 1000
          ).toLocaleString()}
        </p>
        <p>
          <strong>Note:</strong> {order.orderNote || "No note added."}
        </p>
        <p>
          <strong>Restaurant: </strong>
          <Link
            href={`/restaurants/${order.restaurant.name}`}
            className="text-blue-600 hover:underline"
          >
            {order.restaurant?.name || "Unknown Restaurant"}
          </Link>
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Items Ordered
        </h3>
        <div className="space-y-2">
          {Array.isArray(orderedItems) && orderedItems.length > 0 ? (
            orderedItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-100 rounded-md p-3 bg-primary"
              >
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-white">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-secondary">
                  £{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
