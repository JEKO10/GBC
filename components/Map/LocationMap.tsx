"use client";

import { booleanPointInPolygon, circle, point } from "@turf/turf";
import { AdvancedMarker, InfoWindow, Map } from "@vis.gl/react-google-maps";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { Restaurant } from "@/app/map/page";
import marker from "@/public/marker.png";
import { useRestaurantStore } from "@/store/useRestaurantStore";

function filterRestaurantsBy(
  myLocation: { lat: number; lng: number },
  restaurants: Restaurant[],
  miles: number
): Restaurant[] {
  const myLocationPoint = point([myLocation.lng, myLocation.lat]);
  const mapCircle = circle(myLocationPoint, miles, {
    steps: 64,
    units: "miles",
  });

  return restaurants
    .filter((restaurant) => restaurant.lat !== null && restaurant.lng !== null)
    .filter((restaurant) =>
      booleanPointInPolygon(point([restaurant.lng, restaurant.lat]), mapCircle)
    );
}

interface MapProps {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: React.Dispatch<
    React.SetStateAction<Restaurant | null>
  >;
  userLocation: { lat: number; lng: number } | null;
}

function Location({
  selectedRestaurant,
  setSelectedRestaurant,
  userLocation,
}: MapProps) {
  const { restaurants, filteredRestaurants, setFilteredRestaurants } =
    useRestaurantStore();
  const containerRef = useRef(null);

  const filteredResults = useMemo(() => {
    if (!userLocation) return [];
    return filterRestaurantsBy(userLocation, restaurants, 3);
  }, [userLocation, restaurants]);

  useEffect(() => {
    setFilteredRestaurants(filteredResults);
  }, [filteredResults, setFilteredRestaurants]);

  if (!userLocation) return null;
  return (
    <div ref={containerRef}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        className="w-[50vw] h-[50vh] my-0 mx-auto"
        defaultCenter={{
          lat: userLocation.lat,
          lng: userLocation.lng,
        }}
        defaultZoom={12}
        // @TODO pitaj ih hoce li da pomjeraju il ne
        gestureHandling="greedy"
        // gestureHandling="none"
        disableDefaultUI={false}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        keyboardShortcuts={false}
      >
        <AdvancedMarker position={userLocation}>
          <HiOutlineLocationMarker className="text-5xl text-secondary" />
        </AdvancedMarker>
        {filteredRestaurants.map((restaurant) => (
          <AdvancedMarker
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            onClick={() => setSelectedRestaurant(restaurant)}
          >
            <span>
              <Image src={marker} alt="food" width={50} height={50} />
            </span>
          </AdvancedMarker>
        ))}
        {selectedRestaurant && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.lat,
              lng: selectedRestaurant.lng,
            }}
            pixelOffset={[0, -40]}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <Link
              className="text-blue-500"
              href={`/restaurants/${selectedRestaurant.id}`}
            >
              {selectedRestaurant.name}
            </Link>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

export default Location;
