"use client";

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import Image from "next/image";
import React from "react";

import userLoc from "@/public/userLoc.png";

interface UserLocationMapProps {
  userCoords: { lat: number; lng: number };
}

const UserLocationMap = ({ userCoords }: UserLocationMapProps) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY) return null;

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
      language="en"
    >
      <div className="rounded-lg overflow-hidden shadow-md">
        <Map
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          defaultCenter={userCoords}
          defaultZoom={15}
          className="w-full h-[300px]"
          gestureHandling="cooperative"
          disableDefaultUI={true}
          zoomControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          clickableIcons={false}
        >
          <AdvancedMarker position={userCoords}>
            <span>
              <Image
                src={userLoc}
                alt="Marker to show General's Bilimoria Canteen Location"
                width={34}
                height={31}
              />
            </span>
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
};

export default UserLocationMap;
