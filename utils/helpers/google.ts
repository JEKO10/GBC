"use client";
import { Loader } from "@googlemaps/js-api-loader";

import { GOOGLE_MAP_API_KEY } from "../../config/const";

const loader = new Loader({
  apiKey: GOOGLE_MAP_API_KEY,
  version: "weekly",
  libraries: ["places", "marker", "maps", "geocoding"],
});

// lets not interfere with Maps component, visgl will load and we will get a warning :S, if we dont go first
loader.importLibrary("maps");
export async function getPlaceDetails(input: string) {
  const { Place } = await loader.importLibrary("places");

  const request: google.maps.places.SearchByTextRequest = {
    textQuery: input,
    //   https://developers.google.com/maps/documentation/javascript/place-class-data-fields
    fields: [
      "id",
      "location",
      "addressComponents",
      "adrFormatAddress",
      "displayName",
      "types",
      "viewport",
    ],
    maxResultCount: 10,
    // locationBias: { lat: 37.4161493, lng: -122.0812166 }, // Optionally bias results
    language: "en-US",
  };
  //@ts-ignore
  const { places } = await Place.searchByText(request);

  const formattedPlaces = places.map((place) => {
    const addressComponents = place.addressComponents;

    return {
      types: place.types,
      placeId: place.id,
      displayName: place.displayName,
      streetNumber:
        addressComponents?.find((c) => c.types.includes("street_number"))
          ?.longText ?? null,
      street:
        addressComponents?.find((c) => c.types.includes("route"))?.longText ??
        null,
      city:
        addressComponents?.find((c) => c.types.includes("locality"))
          ?.longText ?? null,
      cityCode:
        addressComponents?.find((c) => c.types.includes("locality"))
          ?.shortText ?? null,
      postcode:
        addressComponents?.find((c) => c.types.includes("postal_code"))
          ?.longText ?? null,
      country:
        addressComponents?.find((c) => c.types.includes("country"))?.longText ??
        null,
      countryCode:
        addressComponents?.find((c) => c.types.includes("country"))
          ?.shortText ?? null,
      state:
        addressComponents?.find((c) =>
          c.types.includes("administrative_area_level_1")
        )?.longText ?? null,
      coordinates: place.location,
      viewport: place.viewport,
    } as const;
  });

  return formattedPlaces;
}

export async function getReverseGeoCoding(lat: number, lng: number) {
  const { Geocoder } = await loader.importLibrary("geocoding");

  const request: google.maps.GeocoderRequest = {
    location: { lat, lng },
  };
  //@ts-ignore
  // console.log(Geocoder);
  const geocoder = new Geocoder();

  const { results } = await geocoder.geocode(request);

  const formattedPlaces = results.map((place) => {
    const addressComponents = place.address_components;

    return {
      types: place.types,
      placeId: place.place_id,
      displayName: null,
      streetNumber:
        addressComponents?.find((c) => c.types.includes("street_number"))
          ?.long_name ?? null,
      street:
        addressComponents?.find((c) => c.types.includes("route"))?.long_name ??
        null,
      city:
        addressComponents?.find((c) => c.types.includes("locality"))
          ?.long_name ?? null,
      cityCode:
        addressComponents?.find((c) => c.types.includes("locality"))
          ?.short_name ?? null,
      postcode:
        addressComponents?.find((c) => c.types.includes("postal_code"))
          ?.long_name ?? null,
      country:
        addressComponents?.find((c) => c.types.includes("country"))
          ?.long_name ?? null,
      countryCode:
        addressComponents?.find((c) => c.types.includes("country"))
          ?.short_name ?? null,
      state:
        addressComponents?.find((c) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name ?? null,
      coordinates: place.geometry.location,
      viewport: place.geometry.viewport,
    } as const;
  });

  return formattedPlaces;
}

(window as any).getPlaceDetails = getPlaceDetails;
(window as any).getReverseGeoCoding = getReverseGeoCoding;
