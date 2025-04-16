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
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600 text-lg">
        Please log in to view your orders.
      </div>
    );
  }

  const orders = await getUserOrders(user.id);
  if (!Array.isArray(orders)) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500 text-lg">
        Error loading orders...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Your Orders
      </h1>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            let orderedItems: OrderedItem[] = [];

            if (Array.isArray(order.items)) {
              orderedItems = order.items as unknown as OrderedItem[];
            } else {
              console.error("Unexpected order items format:", order.items);
            }

            return (
              <Order key={order.id} order={order} orderedItems={orderedItems} />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          You haven&apos;t placed any orders yet.
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
