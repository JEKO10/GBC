import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const restaurantName = url.searchParams.get("name");

  if (!restaurantName) {
    return NextResponse.json(
      { error: "Missing restaurant name" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.headers.append(
    "Set-Cookie",
    `cameFromMap=${encodeURIComponent(restaurantName)}; Path=/; HttpOnly; Secure; Max-Age=600; SameSite=Strict`
  );

  return response;
}
