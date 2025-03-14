"use server";

import db from "@/lib/db";

export const getRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({
    orderBy: { id: "asc" },
  });

  return restaurants;
};

export const getRestaurantById = async (id: number) => {
  const restaurant = await db.restaurant.findUnique({
    where: { id },
    select: { name: true },
  });

  return restaurant?.name || "Unknown Restaurant";
};

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
