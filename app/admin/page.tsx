import { UserRole } from "@prisma/client";
import React from "react";

import { getRestaurants } from "@/actions/restaurants";
import RoleGate from "@/components/Auth/RoleGate";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import ToggleStatus from "@/components/ToggleStatus";

const AdminPage = async () => {
  const restaurants = await getRestaurants();

  return (
    <div>
      <RoleGate allowedRole={UserRole.ADMIN}>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center my-20 px-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <RestaurantCard name={restaurant.name} />
              <ToggleStatus id={restaurant.id} isActive={restaurant.isActive} />
            </div>
          ))}
        </section>
      </RoleGate>
    </div>
  );
};

export default AdminPage;
