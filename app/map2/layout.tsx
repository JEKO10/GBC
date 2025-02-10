"use client";
import { GOOGLE_MAP_API_KEY } from "@/config/const";
import { APIProvider } from "@vis.gl/react-google-maps";
import { PropsWithChildren } from "react";

export default function MapLayout(props: PropsWithChildren<{}>) {
  return (
    <APIProvider apiKey={GOOGLE_MAP_API_KEY}>{props.children}</APIProvider>
  );
}
