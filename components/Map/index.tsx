"use client";

// import "../../utils/helpers/google";

import { PickingInfo, WebMercatorViewport } from "@deck.gl/core";
import { IconLayer } from "@deck.gl/layers";
import DeckGL, { DeckGLRef } from "@deck.gl/react";
import { bbox, center, point } from "@turf/turf";
import {
  APIProvider,
  Map as GoogleMap,
  limitTiltRange,
  useApiIsLoaded,
} from "@vis.gl/react-google-maps";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { GOOGLE_MAP_API_KEY, GOOGLE_MAP_ID } from "../../config/const";
import { Marker } from "./model";

export type IconLayerPickingInfo<DataT> = PickingInfo<
  DataT,
  { objects?: DataT[] }
>;

function getCenterAndZoom(
  markers: Marker[],
  containerRef: RefObject<HTMLDivElement>
) {
  // Note order: longitude, latitude.
  const features = markers.map((marker) => point(marker.coordinates));

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
interface MapProps {
  containerRef: RefObject<HTMLDivElement>;
}

export function Map({ containerRef }: MapProps) {
  const deckGlRef = useRef<DeckGLRef<any> | null>(null);
  // const [hoverInfo, setHoverInfo] = useState<PickingInfo<MapData> | null>(null);
  const [markers, setMarkers] = useState<Marker[] | null>(null);

  const [viewState, setViewState] = useState<{
    longitude: number;
    latitude: number;
    zoom: number;
  } | null>(null);

  const [bounds, setBounds] = useState<
    | {
        south: number;
        west: number;
        north: number;
        east: number;
      }
    | null
    | undefined
  >(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Generate 5 random markers within 10km
        const newMarkers: Marker[] = [
          { some_data: "sometest", coordinates: [userLng, userLat] },
        ];

        const { centerLongitude, centerLatitude, zoom, bounds } =
          getCenterAndZoom(newMarkers, containerRef);

        setBounds(bounds);

        setViewState({
          longitude: userLng,
          latitude: userLat,
          zoom: 12,
        });

        setMarkers(newMarkers);
      });
    }
  }, [containerRef]);

  const layers = useMemo(
    () => [
      new IconLayer<Marker>({
        id: "IconLayer",
        data: markers || [],
        // getColor: (d: Marker) => [Math.sqrt(d.exits), 140, 0],
        getIcon: () => "marker",
        getPosition: (d: Marker) => d.coordinates,
        getSize: 40,
        iconAtlas:
          "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
        iconMapping:
          "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json",
        pickable: true,
        onClick: (info: IconLayerPickingInfo<Marker>) => {
          alert(info.object?.some_data);
        },
      }),
    ],
    [markers]
  );

  // useEffect(() => {
  //   if (!markers) {
  //     setViewState({
  //       longitude: 0,
  //       latitude: 0,
  //       zoom: 1,
  //     });
  //     setBounds(undefined as any);
  //     return;
  //   }

  //   const { centerLongitude, centerLatitude, zoom, bounds } = getCenterAndZoom(
  //     markers,
  //     containerRef
  //   );

  //   /**
  //    * ! This works until we have viewState !== null ? in render
  //    */
  //   setViewState({
  //     longitude: centerLongitude,
  //     latitude: centerLatitude,
  //     zoom,
  //   });

  //   setBounds(bounds);
  // }, [containerRef, markers]);

  // const setCurrentLocation = useCallback(
  //   (latitude: number, longitude: number) => {
  //     setViewState((prev) => ({
  //       ...prev!,
  //       latitude,
  //       longitude,
  //       zoom: 16,
  //     }));
  //   },
  //   []
  // );

  // const setZoom = useCallback((zoom: number) => {
  //   setViewState((prev) => ({
  //     ...prev!,
  //     zoom,
  //   }));
  // }, []);

  // const onViewStateChange = useCallback((e: any) => {
  //   setViewState(e.viewState);
  // }, []);

  // viewState changes - https://github.com/visgl/deck.gl/issues/4550
  // console.log({ viewState, bounds, markers });
  return viewState !== null && bounds !== null && markers?.length ? (
    <APIProvider apiKey={GOOGLE_MAP_API_KEY}>
      <DeckGL
        ref={deckGlRef}
        initialViewState={viewState}
        // viewState={viewState}
        // onViewStateChange={onViewStateChange}
        onViewStateChange={limitTiltRange}
        controller
        layers={layers}
      >
        <GoogleMap mapId={GOOGLE_MAP_ID} defaultBounds={bounds} />
        {/* <CustomMapControls
          ref={controlRef}
          deckGl
          deckGlViewState={viewState}
          setZoom={setZoom}
          setCurrentLocation={setCurrentLocation}
        />

        {hoverInfo ? <MapTooltip info={hoverInfo} /> : null} */}
      </DeckGL>
    </APIProvider>
  ) : null;
}

export default Map;
