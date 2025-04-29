import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const address = searchParams.get("address");

  const key = process.env.GOOGLE_MAP_SERVER_API_KEY;
  let apiUrl: string;

  if (lat && lng) {
    apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&key=${key}`;
  } else if (address) {
    apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&language=en&key=${key}`;
  } else {
    return NextResponse.json(
      { error: "Missing address or coordinates" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
