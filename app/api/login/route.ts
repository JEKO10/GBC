import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { allowedOrigins } from "@/helpers/cors";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

function getCorsHeaders(origin: string | null): HeadersInit {
  const allowOrigin =
    origin && allowedOrigins.includes(origin)
      ? origin
      : "https://gbcanteen.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  const { name, password } = await req.json();

  const restaurant = await db.restaurant.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
    },
  });

  if (
    !restaurant ||
    !restaurant.password ||
    !bcrypt.compareSync(password, restaurant.password)
  ) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401, headers: corsHeaders }
    );
  }

  const token = jwt.sign(
    { restaurantId: restaurant.id, name: restaurant.name },
    JWT_SECRET,
    { expiresIn: "100y" }
  );

  return NextResponse.json(
    {
      success: true,
      token,
      name: restaurant.name,
      address: restaurant.address,
    },
    { status: 200, headers: corsHeaders }
  );
}

export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
