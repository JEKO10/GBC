import Order from "@/components/Restaurant/Order";
import { getUserOrders } from "@/data/user";
import { currentUser } from "@/lib/auth";

export interface OrderedItem {
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

          if (Array.isArray(order.items)) {
            orderedItems = order.items as unknown as OrderedItem[];
          } else {
            console.error("Unexpected order items format:", order.items);
          }

          return (
            <Order key={order.id} order={order} orderedItems={orderedItems} />
          );
        })
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
