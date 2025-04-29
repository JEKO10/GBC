"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { getRestaurants } from "@/actions/restaurants";
import ScrollingBanner from "@/components/Home/ScrollingBanner";
import LocationInput from "@/components/Map/LocationInput";
import Restaurants from "@/components/Map/Restaurants";
import General from "@/public/map.png";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useUserLocationStore } from "@/store/useUserLocationStore";

const Map = dynamic(() => import("@/components/Map/LocationMap"), {
  ssr: false,
  loading: () => <div className="map-loader" />,
});

export interface Restaurant {
  id: number;
  name: string;
  lat: number;
  lng: number;
  cuisine?: string;
}

const MapPage = () => {
  const { restaurants, setRestaurants } = useRestaurantStore();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const { coords: userLocation, setCoords } = useUserLocationStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await getRestaurants();

        const formattedData = response
          .filter((restaurant) => restaurant.isActive)
          .map((restaurant) => ({
            id: restaurant.id,
            name: restaurant.name,
            lat: restaurant.lat ?? 0,
            lng: restaurant.lng ?? 0,
            cuisine: restaurant.cuisine ?? "Not specified",
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

    if (!userLocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(coords);
      });
    }
  }, [restaurants.length, setRestaurants, setCoords, userLocation]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY) {
    console.log("Google API key is not defined");
    return null;
  }

  return (
    <div>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
        language="en"
      >
        {isLoading ? (
          <div className="loading" />
        ) : (
          <section className="flex flex-col items-center justify-center px-5">
            <LocationInput
              onLocationSelect={(coords) => {
                setCoords(coords);
              }}
            />
            {restaurants.length > 0 ? (
              <>
                <div className="flex items-center gap-x-6 my-5">
                  <Map
                    selectedRestaurant={selectedRestaurant}
                    setSelectedRestaurant={setSelectedRestaurant}
                    userLocation={userLocation}
                  />
                  <Image
                    src={General}
                    title="General Faridoon Bilimoria - The Inspiration Behind GBC"
                    alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
                    className="w-[250px] h-full hidden lg:block"
                    loading="lazy"
                  />
                </div>
                <Restaurants selectedRestaurant={selectedRestaurant} />
              </>
            ) : (
              <div className="text-center mt-10 text-gray-500">
                No restaurants found.
              </div>
            )}
          </section>
        )}
      </APIProvider>
      <ScrollingBanner />
    </div>
  );
};

export default MapPage;
