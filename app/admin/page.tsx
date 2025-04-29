import { UserRole } from "@prisma/client";
import React from "react";

import { getOrders, getRestaurants } from "@/actions/restaurants";
import Orders from "@/components/Admin/Orders";
import RoleGate from "@/components/Auth/RoleGate";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import ToggleStatus from "@/components/ToggleStatus";

const AdminPage = async () => {
  const restaurants = await getRestaurants();
  const orders = await getOrders();

  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <Orders
        orders={orders}
        restaurants={restaurants.map(({ id, name }) => ({ id, name }))}
      />
      <h2 className="mt-20 px-6 md:px-14 text-2xl font-bold">
        Restaurant activation
      </h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-20 justify-items-center mt-8 mb-20 px-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="relative">
            <p className="text-lg font-bold absolute top-0 left-0 bg-body rounded-md px-2 z-50 text-primary">
              ID: {restaurant.id}
            </p>
            <RestaurantCard name={restaurant.name} />
            <ToggleStatus id={restaurant.id} isActive={restaurant.isActive} />
          </div>
        ))}
      </section>
    </RoleGate>
  );
};

export default AdminPage;
