"use client";

import React from "react";

import { Restaurant } from "@/app/map/page";
import { useRestaurantStore } from "@/store/useRestaurantStore";

import RestaurantCard from "../Restaurant/RestaurantCard";

const Restaurants = ({
  selectedRestaurant,
}: {
  selectedRestaurant: Restaurant | null;
}) => {
  const { filteredRestaurants } = useRestaurantStore();

  return (
    <div>
      {selectedRestaurant?.name && (
        <div className="flex flex-col flex-wrap gap-10 justify-center items-center mt-5 mb-10">
          <h3>Selected Restaurant:</h3>
          <RestaurantCard name={selectedRestaurant.name} />
        </div>
      )}
      <h3>Restaurants within 3 miles from your address:</h3>
      {filteredRestaurants.length > 0 ? (
        <section className="flex flex-wrap gap-10 justify-center my-10">
          {filteredRestaurants.map((restaurant) => (
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
