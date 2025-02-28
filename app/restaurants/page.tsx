import React from "react";

import { getRestaurants } from "@/actions/restaurants";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";

const RestaurantsPage = async () => {
  const restaurants = await getRestaurants();

  return (
    <div>
      <h2 className="text-4xl my-20 text-center">
        All of our restaurans in one place!
      </h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center px-6">
        {restaurants
          .filter((restaurant) => restaurant.isActive)
          .map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              name={restaurant.name}
              id={restaurant.id}
            />
          ))}
      </section>
    </div>
  );
};

export default RestaurantsPage;
