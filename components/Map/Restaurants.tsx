"use client";

import React, { useMemo, useState } from "react";

import { Restaurant } from "@/app/map/page";
import { useRestaurantStore } from "@/store/useRestaurantStore";

import RestaurantCard from "../Restaurant/RestaurantCard";

const Restaurants = ({
  selectedRestaurant,
}: {
  selectedRestaurant: Restaurant | null;
}) => {
  const { filteredRestaurants } = useRestaurantStore();
  const [selectedCuisine, setSelectedCuisine] = useState<string | undefined>(
    ""
  );

  const cuisines = useMemo(() => {
    const all = filteredRestaurants.map((r) => r.cuisine).filter(Boolean);
    return Array.from(new Set(all));
  }, [filteredRestaurants]);

  const visibleRestaurants = useMemo(() => {
    if (!selectedCuisine) return filteredRestaurants;
    return filteredRestaurants.filter(
      (restaurant) => restaurant.cuisine === selectedCuisine
    );
  }, [filteredRestaurants, selectedCuisine]);

  return (
    <div className="mt-5">
      {selectedRestaurant?.name && (
        <div className="flex flex-col flex-wrap gap-10 justify-center items-center mb-10">
          <h3 className="text-xl font-semibold">Selected Restaurant:</h3>
          <RestaurantCard
            name={selectedRestaurant.name}
            cuisine={selectedRestaurant.cuisine}
          />
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">
          Restaurants within 3 miles from your address:
        </h3>
        {cuisines.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCuisine("")}
              className={`px-4 py-2 rounded-md ${
                selectedCuisine === ""
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All cuisines
            </button>
            {cuisines.map((cuisine, index) => (
              <button
                key={index}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-md ${
                  selectedCuisine === cuisine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        )}
      </div>

      {visibleRestaurants.length > 0 ? (
        <section className="flex flex-wrap gap-10 justify-center my-10">
          {visibleRestaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <RestaurantCard
                name={restaurant.name}
                cuisine={restaurant.cuisine}
              />
            </div>
          ))}
        </section>
      ) : (
        <p className="text-gray-500 text-center mt-5">
          No restaurants match this cuisine in your area.
        </p>
      )}
    </div>
  );
};

export default Restaurants;
