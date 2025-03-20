"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { getRestaurants } from "@/actions/restaurants";
import Restaurants from "@/components/Map/Restaurants";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const Map = dynamic(() => import("@/components/Map/Location"), {
  ssr: false,
  loading: () => <div className="loading" />,
});

export interface Restaurant {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

const MapPage = () => {
  const { restaurants, setRestaurants } = useRestaurantStore();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await getRestaurants();

        const formattedData = response.map((restaurant) => ({
          id: restaurant.id,
          name: restaurant.name,
          lat: restaurant.lat ?? 0,
          lng: restaurant.lng ?? 0,
        }));

        setRestaurants(formattedData);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurants.length === 0) {
      fetchRestaurants();
    } else {
      setIsLoading(false);
    }
  }, [restaurants.length, setRestaurants]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY) {
    console.log("Google API key is not defined");
    return null;
  }

  return (
    <div>
      {isLoading ? (
        <div className="loading" />
      ) : restaurants.length > 0 ? (
        <>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
            <Map
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
            />
          </APIProvider>
          <Restaurants selectedRestaurant={selectedRestaurant} />
        </>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          No restaurants found.
        </div>
      )}
    </div>
  );
};

export default MapPage;
