"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { capitalize } from "@/helpers/capitalize";
import { useRestaurantStore } from "@/store/useRestaurantStore";

import Basket from "./Basket";
import CardSkeleton from "./CardSkeleton";

const MenuCard = dynamic(() => import("./MenuCard"), {
  loading: () => <CardSkeleton />,
});

interface MenuProps {
  menu?: {
    id: number;
    title: string;
    restaurant_id: number;
    category: string | null;
    price: number;
    description: string | null;
    imageUrl: string | null;
  }[];
}

const Menu = ({ menu }: MenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "All"
  );
  const [toasts, setToasts] = useState<string[]>([]);
  const [basketItems, setBasketItems] = useState<{ [key: string]: number }>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("basketItems");
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    }
  );
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const { filteredRestaurants } = useRestaurantStore();
  const restaurantId = menu?.[0]?.restaurant_id;
  const router = useRouter();

  const restaurantExists = useMemo(() => {
    return filteredRestaurants.some(
      (restaurant) => restaurant.id === restaurantId
    );
  }, [filteredRestaurants, restaurantId]);

  useEffect(() => {
    if (!restaurantExists) {
      router.replace("/restaurants");
    }
  }, [restaurantExists, router]);

  const uniqueCategories = useMemo(
    () => [
      ...new Set(menu?.map((menuItem) => menuItem.category).filter(Boolean)),
    ],
    [menu]
  );
  const filteredMenu = useMemo(() => {
    const sortedMenu = [...(menu || [])].sort((a, b) => a.id - b.id);
    return selectedCategory && selectedCategory !== "All"
      ? sortedMenu.filter((item) => item.category === selectedCategory)
      : sortedMenu;
  }, [menu, selectedCategory]);

  const handleQuantityChange = useCallback(
    (itemName: string, delta: number) => {
      setBasketItems((prev) => {
        const updatedBasket = {
          ...prev,
          [itemName]: (prev[itemName] || 0) + delta,
        };

        if (updatedBasket[itemName] <= 0) {
          delete updatedBasket[itemName];
        }

        return updatedBasket;
      });

      if (delta > 0) {
        const newToast = `${itemName} added to basket`;
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
          setToasts((prev) => prev.slice(1));
        }, 1500);
      }
    },
    []
  );

  useEffect(() => {
    const filteredItems = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(basketItems).filter(([_, quantity]) => quantity > 0)
    );
    localStorage.setItem("basketItems", JSON.stringify(filteredItems));
  }, [basketItems]);

  useEffect(() => {
    const previousId = localStorage.getItem("restaurantId");
    const currentId = menu?.[0]?.restaurant_id?.toString();

    if (previousId !== currentId) {
      localStorage.setItem("basketItems", JSON.stringify({}));
      localStorage.setItem("restaurantId", currentId || "unknown");
      setBasketItems({});
    }
  }, [menu]);

  useEffect(() => {
    document.body.style.overflow = isBasketOpen ? "hidden" : "auto";
  }, [isBasketOpen]);

  return (
    <div className="font-outfit w-full max-w-7xl mx-auto px-4">
      <div className="my-14">
        <h3 className="text-xl font-semibold mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === "All"
                ? "bg-secondary text-white"
                : "bg-primary text-white"
            }`}
          >
            All
          </button>
          {uniqueCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? "bg-secondary text-white"
                  : "bg-primary text-white"
              }`}
            >
              {capitalize(category)}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
        {filteredMenu?.map((menuItem) => (
          <MenuCard
            key={menuItem.id}
            name={menuItem.title}
            price={menuItem.price}
            category={menuItem.category ?? "Uncategorized"}
            description={menuItem.description ?? "No description available"}
            image={menuItem.imageUrl}
            quantity={basketItems[menuItem.title] || 0}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </section>
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-[9999]">
        {toasts.map((msg, i) => (
          <div
            key={i}
            className="bg-secondary text-white px-4 py-2 rounded-md shadow-md animate-fade"
          >
            {msg}
          </div>
        ))}
      </div>

      {Object.keys(basketItems).length > 0 && (
        <button
          onClick={() => setIsBasketOpen(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white font-semibold px-6 py-3 rounded-full shadow-lg z-50"
        >
          View Basket ({Object.values(basketItems).reduce((a, b) => a + b, 0)})
        </button>
      )}
      {isBasketOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
            <button
              onClick={() => setIsBasketOpen(false)}
              className="absolute top-2 right-4 text-2xl font-bold"
            >
              ×
            </button>
            <Basket
              items={basketItems}
              menu={menu}
              handleQuantityChange={handleQuantityChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
