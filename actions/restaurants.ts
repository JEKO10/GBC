"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";

export const getRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({
    orderBy: { id: "asc" },
  });

  return restaurants;
};

// @TODO useless as for now
// export const getRestaurantById = async (id: number) => {
//   const restaurant = await db.restaurant.findUnique({
//     where: { id },
//     select: { name: true },
//   });

//   return restaurant?.name || "Unknown Restaurant";
// };

export const getRestaurantWithMenu = async (name: string) => {
  const restaurant = await db.restaurant.findUnique({
    where: { name },
    include: { menus: true },
  });

  if (!restaurant) return null;

  return {
    ...restaurant,
    menus: restaurant.menus.map((menu) => ({
      ...menu,
      price: menu.price ? menu.price.toNumber() : 0,
    })),
  };
};

export const updateRestaurantStatus = async (id: number) => {
  const restaurant = await db.restaurant.findUnique({
    where: { id },
  });
  if (!restaurant) {
    return { error: "Restaurant not found!" };
  }

  await db.restaurant.update({
    where: { id },
    data: { isActive: !restaurant.isActive },
  });

  revalidatePath("/admin");
};

export const getOrders = async () => {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      orderNumber: true,
      amount: true,
      status: true,
      stripeId: true,
      orderNote: true,
      createdAt: true,
      userId: true,
      restaurantId: true,
      items: true,
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
          googleAddress: true,
        },
      },
    },
  });

  return orders;
};
