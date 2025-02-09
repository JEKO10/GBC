"use client";

import dynamic from "next/dynamic";

import { RefObject, useRef } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

function MapPage() {
  const containerRef = useRef<HTMLDivElement>(
    null
  ) as RefObject<HTMLDivElement>;

  return (
    <div ref={containerRef}>
      <Map containerRef={containerRef} />
    </div>
  );
}

export default MapPage;
