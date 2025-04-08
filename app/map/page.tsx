"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import { getRestaurants } from "@/actions/restaurants";
import LocationInput from "@/components/Map/LocationInput";
import Restaurants from "@/components/Map/Restaurants";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const Map = dynamic(() => import("@/components/Map/LocationMap"), {
  ssr: false,
  loading: () => <div className="map-loader" />,
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
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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

    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.lat && parsed?.lng) {
          setUserLocation(parsed);
        }
      } catch {
        console.warn("Failed to load user location from storage.");
      }
    }

    if (!saved && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        localStorage.setItem("userLocation", JSON.stringify(coords));
      });
    }
  }, [restaurants.length, setRestaurants]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY) {
    console.log("Google API key is not defined");
    return null;
  }

  return (
    <div>
      {/* @TODO nekako na server .env */}
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
        {isLoading ? (
          <div className="loading" />
        ) : (
          <>
            <LocationInput
              onLocationSelect={(coords) => {
                setUserLocation(coords);
                localStorage.setItem("userLocation", JSON.stringify(coords));
              }}
            />
            {restaurants.length > 0 ? (
              <>
                <Map
                  selectedRestaurant={selectedRestaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                  userLocation={userLocation}
                />
                <Restaurants selectedRestaurant={selectedRestaurant} />
              </>
            ) : (
              <div className="text-center mt-10 text-gray-500">
                No restaurants found.
              </div>
            )}
          </>
        )}
      </APIProvider>
    </div>
  );
};

export default MapPage;
