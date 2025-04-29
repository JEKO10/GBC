"use client";

import Link from "next/link";
import { JsonValue } from "next-auth/adapters";
import React, { useEffect, useState } from "react";

import { OrderedItem } from "@/app/profile/orders/page";

interface OrdersProps {
  orders: {
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
    restaurant: {
      id: number;
      name: string;
    };
    user: {
      name: string;
      email: string;
      phone: string | null;
      address: string | null;
      googleAddress: string | null;
    };
  }[];
  restaurants: { id: number; name: string }[];
}

const Orders = ({ orders, restaurants }: OrdersProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const filteredOrders = orders.filter((order) => {
    const matchesRestaurant =
      selectedRestaurant === "all" ||
      String(order.restaurant.name) === selectedRestaurant;

    const formattedOrderDate = new Date(order.createdAt).toLocaleDateString(
      "en-CA",
      { timeZone: "Europe/London" }
    );

    const matchesDate = !selectedDate || formattedOrderDate === selectedDate;

    return matchesRestaurant && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const totalCount = filteredOrders.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRestaurant, selectedDate]);

  return (
    <section className="my-20 px-6 md:px-14">
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>

        <div className="bg-white rounded-xl border border-secondary shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm sm:text-base text-gray-700">
            On{" "}
            <span className="font-semibold text-primary">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "all dates"}
            </span>
            , {selectedRestaurant} received{" "}
            <span className="font-semibold text-secondary">{totalCount}</span>{" "}
            order{filteredOrders.length !== 1 && "s"} totaling{" "}
            <span className="font-semibold text-secondary">
              £{(totalAmount / 100).toFixed(2)}
            </span>
            .
          </div>
          <div className="text-xs text-gray-500">
            Updated at {new Date().toLocaleTimeString("en-GB")}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Restaurant
          </label>
          <select
            className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700"
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
          >
            <option value="all">All Restaurants</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedOrders.map((order) => {
          const orderedItems: OrderedItem[] = Array.isArray(order.items)
            ? (order.items as unknown as OrderedItem[])
            : [];

          return (
            <article
              key={order.id}
              className="bg-white rounded-xl shadow p-6 space-y-6 border border-gray-200"
            >
              <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-sm text-gray-700 space-y-1">
                <p>
                  <strong>User:</strong> {order.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.user.phone}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {order.user.address || order.user.googleAddress || "N/A"}
                </p>
              </div>

              <div className="border border-secondary rounded-lg p-5 bg-gradient-to-br from-white via-neutral-50 to-white shadow-sm space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary">
                      Order #{order.orderNumber.split("-").pop()}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium border ${
                      order.status === "Completed" || order.status === "Ready"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Total:</strong> £{(order.amount / 100).toFixed(2)}
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
                  <p className="col-span-2">
                    <strong>Restaurant: </strong>
                    <Link
                      href={`/restaurants/${order.restaurant.name}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.restaurant.name}
                    </Link>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Items Ordered
                  </h3>
                  <div className="space-y-2">
                    {orderedItems.length > 0 ? (
                      orderedItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-primary text-white rounded-md px-4 py-3"
                        >
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm">Quantity: {item.quantity}</p>
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
            </article>
          );
        })}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === page
                    ? "bg-primary text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
