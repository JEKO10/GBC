"use client";

import { booleanPointInPolygon, circle, point } from "@turf/turf";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { setUserAddress } from "@/actions/settings";
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
}

function Location({ selectedRestaurant, setSelectedRestaurant }: MapProps) {
  const { restaurants, filteredRestaurants, setFilteredRestaurants } =
    useRestaurantStore();
  const [myPosition, setMyPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const inputRef = useRef(null);
  const placesLib = useMapsLibrary("places");
  const map = useMap();
  const containerRef = useRef(null);

  const filteredResults = useMemo(() => {
    if (!myPosition) return [];
    return filterRestaurantsBy(myPosition, restaurants, 3);
  }, [myPosition, restaurants]);

  useEffect(() => {
    setFilteredRestaurants(filteredResults);
  }, [filteredResults, setFilteredRestaurants]);

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");

    if (savedLocation) {
      setMyPosition(JSON.parse(savedLocation));
      setIsLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMyPosition(userLocation);
          localStorage.setItem("userLocation", JSON.stringify(userLocation));
          setIsLoading(false);
        },
        () => setIsLoading(false),
        { enableHighAccuracy: true }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      if (location) {
        const latLngLiteral = { lat: location.lat(), lng: location.lng() };
        setMyPosition(latLngLiteral);
        localStorage.setItem("userLocation", JSON.stringify(latLngLiteral));
        map?.setCenter(latLngLiteral);
        map?.setZoom(14);

        (async () => {
          if (place.formatted_address) {
            // @TODO mozda da prikazem poruku, success address
            await setUserAddress(place.formatted_address);
          }
        })();
      }
    });
  }, [placesLib, map]);

  if (isLoading) return <div className="loading" />;
  if (!myPosition) return null;
  return (
    <div ref={containerRef}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="absolute z-10 bg-white p-3"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your location"
          className="mr-3 p-2"
        />
      </form>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        className="w-[80vw] h-[80vh] my-0 mx-auto"
        defaultCenter={{
          lat: myPosition.lat,
          lng: myPosition.lng,
        }}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
        scaleControl={true}
      >
        <AdvancedMarker position={myPosition}>
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
