import Link from "next/link";

import { getUserOrders } from "@/data/user";
import { currentUser } from "@/lib/auth";

interface OrderedItem {
  title: string;
  quantity: number;
  price: number;
}

const OrdersPage = async () => {
  const user = await currentUser();
  if (!user) {
    return <p>Please log in to view your orders.</p>;
  }

  const orders = await getUserOrders(user.id);
  if (!Array.isArray(orders)) {
    return <p>Error loading orders...</p>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        orders.map((order) => {
          let orderedItems: OrderedItem[] = [];

          return (
            <div
              key={order.id}
              className="border-2 border-white rounded-md p-3 my-3"
            >
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
                  new Date(order.createdAt).getTime() + 60 * 60 * 1000
                ).toLocaleString()}
              </p>
              <p>
                <strong>Restaurant: </strong>
                <Link
                  href={`/restaurants/${order.restaurant.id}`}
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
                    style={{
                      marginBottom: "10px",
                      padding: "5px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <p>
                      <strong>{item?.title}</strong> x{item?.quantity} - £
                      {item?.price.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p>No items found.</p>
              )}
            </div>
          );
        })
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
