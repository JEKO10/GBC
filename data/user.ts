"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserByPhone = async (phone: string) => {
  try {
    const user = await db.user.findUnique({
      where: { phone },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserOrders = async (userId: string) => {
  if (!userId) {
    return [];
  }

  try {
    const orders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: { select: { name: true, id: true } },
      },
    });

    return orders;
  } catch {
    return [];
  }
};

export const deleteOrder = async (orderId: string) => {
  if (!orderId) {
    return { error: "Order does not exist!" };
  }

  try {
    await db.order.delete({
      where: { id: orderId },
    });

    revalidatePath("/profile/orders");
    return { success: "Order deleted!" };
  } catch {
    return { error: "Error deleting order!" };
  }
};
