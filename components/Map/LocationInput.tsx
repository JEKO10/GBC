"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

import { getUserAddress, setUserAddress } from "@/actions/settings";
import { useUserLocationStore } from "@/store/useUserLocationStore";

interface LocationInputProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const LocationInput = ({ onLocationSelect }: LocationInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary("places");
  const map = useMap();
  const [locationDenied, setLocationDenied] = useState<boolean>(false);
  const { setCoords, address, setAddress } = useUserLocationStore();

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "GB" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const location = place.geometry?.location;

      if (location) {
        const latLng = { lat: location.lat(), lng: location.lng() };
        onLocationSelect(latLng);
        setCoords(latLng);
        setLocationDenied(false);
        map?.setCenter(latLng);
        map?.setZoom(12);

        (async () => {
          try {
            if (place.formatted_address) {
              await setUserAddress(place.formatted_address);
              setAddress(place.formatted_address);
            }
          } catch (err) {
            console.error("Failed to set address:", err);
          }
        })();
      }
    });
  }, [placesLib, map, onLocationSelect, setCoords, setAddress]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const result = await getUserAddress();

        if ("address" in result && result.address) {
          const dbAddress = result.address.trim();
          const localAddress = address.trim();

          if (dbAddress === localAddress && localAddress.length > 0) {
            console.log("Addresses match, no need to geocode again.");
            return;
          }

          setAddress(dbAddress);

          const res = await fetch(
            `/api/reverse-geocode?address=${encodeURIComponent(result.address.trim())}`
          );
          const data = await res.json();
          const coords = data?.results?.[0]?.geometry?.location;
          if (coords) {
            setCoords(coords);
            map?.setCenter(coords);
          }

          return;
        }

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            setCoords(coords);
            map?.setCenter(coords);

            try {
              const response = await fetch(
                `/api/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}`
              );
              const data = await response.json();
              const formatted = data?.results?.[0]?.formatted_address;

              if (formatted) {
                setAddress(formatted);
                await setUserAddress(formatted);
              }
            } catch (err) {
              console.error("Reverse geocoding failed:", err);
            }
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setLocationDenied(true);
            }
          },
          { timeout: 10000 }
        );
      } catch (err) {
        console.error("Failed to fetch DB address:", err);
      }
    };

    fetchUserAddress();
  }, [setCoords, setAddress, map]);

  return (
    <div className="font-outfit w-full lg:w-1/2 mt-5 bg-secondary p-3 shadow-lg rounded-lg">
      {locationDenied && (
        <div className="mb-3 text-sm text-body">
          <p className="mb-2">📍 Location access was denied.</p>
          <p>
            To see nearby restaurants, please enable location access in your
            browser or manually enter your location below:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700">
            <li>Click the lock icon next to the URL bar</li>
            <li>Find Location and choose Allow</li>
            <li>Reload the page</li>
          </ul>
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          defaultValue={address}
          type="text"
          placeholder="Enter your delivery location"
          className="bg-primary text-body mr-3 p-2 rounded w-full outline-none"
        />
        {address?.trim() && <p className="text-sm text-body mt-2">{address}</p>}
      </form>
    </div>
  );
};

export default LocationInput;
