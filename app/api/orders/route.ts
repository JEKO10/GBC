import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { allowedOrigins } from "@/helpers/cors";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

function getCorsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : "*"; // default to "*" for React Native or restrict in prod

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const origin = req.headers.get("origin");

  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: getCorsHeaders(origin),
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const { restaurantId } = jwt.verify(token, JWT_SECRET) as {
      restaurantId: number;
    };

    const orders = await db.order.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        stripeId: true,
        amount: true,
        createdAt: true,
        items: true,
        status: true,
        orderNote: true,
        restaurant: {
          select: { name: true },
        },
        // @TODO makni iz history
        user: {
          select: {
            name: true,
            address: true,
            googleAddress: true,
            phone: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(orders), {
      headers: getCorsHeaders(origin),
    });
  } catch {
    return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
      status: 403,
      headers: getCorsHeaders(origin),
    });
  }
}

export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
