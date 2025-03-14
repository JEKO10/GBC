import React from "react";

import { Restaurant } from "@/app/map/page";

import RestaurantCard from "../Restaurant/RestaurantCard";

interface RestaurantsProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
}

const Restaurants = ({ restaurants, selectedRestaurant }: RestaurantsProps) => {
  return (
    <div>
      {selectedRestaurant?.name && (
        <div className="flex flex-col flex-wrap gap-10 justify-center items-center mt-5 mb-10">
          <h3>Selected Restaurant:</h3>
          <RestaurantCard name={selectedRestaurant.name} />
        </div>
      )}
      Restaurants within 3 miles from your address:
      {restaurants.length > 0 ? (
        <section className="flex flex-wrap gap-10 justify-center my-10">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <RestaurantCard name={restaurant.name} />
            </div>
          ))}
        </section>
      ) : (
        <p className="text-gray-500 text-center mt-5">
          There are no restaurants in your area.
        </p>
      )}
    </div>
  );
};

export default Restaurants;
