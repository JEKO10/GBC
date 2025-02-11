/* eslint-disable @next/next/no-img-element */
"use client";

import { GOOGLE_MAP_ID } from "@/config/const";
import { WebMercatorViewport } from "@deck.gl/core";
import { bbox, center, point, circle, booleanPointInPolygon } from "@turf/turf";
import {
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

import restaurantsData from "./restorani.json";
import PersonMarker from "./personMarker";

const imgString =
  "data:image/png;base64,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";

interface GeoData {
  name: string;
  lat: number;
  lng: number;
}
function getCenterAndZoom(
  data: GeoData[],
  containerRef: RefObject<HTMLDivElement>
) {
  // Note order: longitude, latitude.
  const features = data.map((d) => point([d.lng, d.lat]));

  const bounds = bbox({
    type: "FeatureCollection",
    features,
  });

  const centerPoint = center({
    type: "FeatureCollection",
    features,
  });
  const [centerLongitude, centerLatitude] = centerPoint.geometry.coordinates;

  if (!containerRef.current) {
    throw new Error("No container ref");
  }

  const containerSize = containerRef.current?.getBoundingClientRect();
  const { /* centerLongitude, centerLatitude, */ zoom } =
    new WebMercatorViewport({
      width: containerSize.width === 0 ? 1000 : containerSize.width,
      height: containerSize.height === 0 ? 1000 : containerSize.height,
    }).fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      { padding: { top: 100, bottom: 100, left: 100, right: 100 } }
    );

  return {
    centerLongitude,
    centerLatitude,
    bounds: {
      south: bounds[1],
      west: bounds[0],
      north: bounds[3],
      east: bounds[2],
    },
    zoom,
  };
}

function filterRestaurantsBy(
  myLocation: Omit<GeoData, "name">,
  restaurants: GeoData[],
  km: number
) {
  const myLocationPoint = point([myLocation.lng, myLocation.lat]);
  const mapCircle = circle(myLocationPoint, km, {
    steps: 64,
    units: "kilometers",
  });

  const points = restaurants.map((r) => point([r.lng, r.lat], { orgData: r }));
  // Filter points that fall within the circle
  const nearbyPoints = points.filter((point) => {
    return booleanPointInPolygon(point, mapCircle);
  });

  return nearbyPoints;
}

function Map2Page() {
  const [restaurants, setRestaurants] = useState<GeoData[]>(
    restaurantsData.map((r) => ({
      name: r.name,
      lat: r.coordinates[0],
      lng: r.coordinates[1],
    }))
  );

  const [myPosition, setMyPosition] = useState<Omit<GeoData, "name"> | null>(
    null
  );

  // const [error, setError] =
  //   useState<google.maps.places.PlacesServiceStatus | null>(null);

  const placesLib = useMapsLibrary("places");
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredRestaurants = useMemo(
    () => (myPosition ? filterRestaurantsBy(myPosition, restaurants, 20) : []),
    [myPosition, restaurants]
  );

  useEffect(() => {
    if (!placesLib || !map) {
      return;
      console.error("placesLib or map is not loaded");
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // const userLat = position.coords.latitude;
        // const userLng = position.coords.longitude;
        const userLat = 51.6320422;
        const userLng = -0.6272924;
        setMyPosition({ lat: userLat, lng: userLng });

        const { centerLongitude, centerLatitude, zoom } = getCenterAndZoom(
          restaurants,
          containerRef as RefObject<HTMLDivElement>
        );

        map.setCenter(
          new window.google.maps.LatLng(centerLatitude, centerLongitude)
        );
        map.setZoom(zoom);

        // const request = {
        //   location: new window.google.maps.LatLng(userLat, userLng),
        //   radius: 3000, // 3 km radius
        //   type: "restaurant", // Searching for restaurants
        // };
        // const placesService = new placesLib.PlacesService(map);

        // placesService.nearbySearch(request, (results, status) => {
        //   if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        //     setRestaurants(results ?? []);
        //     const resultGeoLocations = (results ?? [])
        //       .map((r) => r.geometry?.location)
        //       .filter(Boolean) as google.maps.LatLng[];

        //     const { centerLongitude, centerLatitude, zoom } = getCenterAndZoom(
        //       resultGeoLocations,
        //       containerRef as RefObject<HTMLDivElement>
        //     );

        //     map.setCenter(
        //       new window.google.maps.LatLng(centerLatitude, centerLongitude)
        //     );
        //     map.setZoom(zoom);
        //   } else {
        //     setError(status);
        //   }
        // });
      });
    }
  }, [map, placesLib, restaurants]);

  return (
    <div ref={containerRef}>
      <Map
        mapId={GOOGLE_MAP_ID}
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        scaleControl={true}
      >
        {myPosition ? (
          <AdvancedMarker
            position={{ lat: myPosition.lat, lng: myPosition.lng }}
            onClick={() => {
              alert("test");
            }}
          >
            <PersonMarker />
          </AdvancedMarker>
        ) : null}
        {filteredRestaurants.map((restaurant) => {
          return (
            <AdvancedMarker
              key={restaurant.properties.orgData.name}
              position={{
                lat: restaurant.properties.orgData.lat,
                lng: restaurant.properties.orgData.lng,
              }}
              onClick={() => {
                alert("test");
              }}
            >
              <span>
                <img alt="food" src={imgString}></img>
              </span>
            </AdvancedMarker>
          );
        })}
      </Map>
    </div>
  );
}

export default Map2Page;
