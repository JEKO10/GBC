import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const statusOrder = [
  "Pending",
  "Preparing",
  "Ready",
  "Dispatched",
  "Completed",
  "Cancelled",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const authHeader = req.headers.get("Authorization");
  const origin = req.headers.get("origin");

  const getCorsHeaders = (origin: string | null): HeadersInit => ({
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  });

  if (!authHeader?.startsWith("Bearer ")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: getCorsHeaders(origin),
    });
  }

  try {
    if (!authHeader?.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: getCorsHeaders(origin),
      });
    }
    const token = authHeader.split(" ")[1];

    const { orderId } = await params;
    const { restaurantId } = jwt.verify(token, JWT_SECRET) as {
      restaurantId: number;
    };

    const { status: newStatus } = await req.json();

    if (!newStatus || typeof newStatus !== "string") {
      return new NextResponse(JSON.stringify({ error: "Invalid status" }), {
        status: 400,
        headers: getCorsHeaders(origin),
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.restaurantId !== restaurantId) {
      return new NextResponse(
        JSON.stringify({ error: "Order not found or forbidden" }),
        {
          status: 403,
          headers: getCorsHeaders(origin),
        }
      );
    }

    const currentIndex = statusOrder.indexOf(order.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (
      newStatus !== order.status &&
      newStatus !== "Cancelled" &&
      newStatus !== "Completed" &&
      (newIndex < currentIndex || newIndex === -1)
    ) {
      return new NextResponse(
        JSON.stringify({
          error: `Cannot move order from ${order.status} to ${newStatus}`,
        }),
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  } catch (error) {
    console.error("Status update error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Invalid token or server error" }),
      {
        status: 403,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

export function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      Vary: "Origin",
    },
  });
}
