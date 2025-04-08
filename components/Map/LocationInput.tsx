"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

import { setUserAddress } from "@/actions/settings";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface LocationInputProps {
  // eslint-disable-next-line no-unused-vars
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const LocationInput = ({ onLocationSelect }: LocationInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary("places");
  const map = useMap();
  const user = useCurrentUser();
  const [address, setAddress] = useState<string | undefined>(user?.address);
  const [locationDenied, setLocationDenied] = useState<boolean>(false);

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
        localStorage.setItem("userLocation", JSON.stringify(latLng));
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
  }, [placesLib, map, onLocationSelect]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const savedLocation = localStorage.getItem("userLocation");

    navigator.geolocation.getCurrentPosition(
      () => setLocationDenied(false),
      (error) => {
        if (error.code === error.PERMISSION_DENIED && !savedLocation) {
          setLocationDenied(true);
        }
      }
    );
  }, []);

  return (
    <div className="absolute z-10 bg-white p-3 shadow-lg rounded-lg">
      {locationDenied && (
        <div className="mb-3 text-sm text-red-600">
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
          type="text"
          placeholder="Enter your location"
          className="mr-3 p-2 rounded border border-gray-300 w-64"
        />
        {address && <p className="text-sm text-gray-600 mt-2">{address}</p>}
      </form>
    </div>
  );
};

export default LocationInput;
