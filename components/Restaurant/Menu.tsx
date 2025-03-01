"use client";

import React, { useEffect, useState } from "react";

import Basket from "./Basket";
import MenuCard from "./MenuCard";

interface MenuProps {
  menu?: {
    id: number;
    title: string;
    restaurant_id: number;
    category: string | null;
    price: number;
    description: string | null;
  }[];
}

const Menu = ({ menu }: MenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [basketItems, setBasketItems] = useState<{ [key: string]: number }>(
    () => {
      const saved = localStorage.getItem("basketItems");
      return saved ? JSON.parse(saved) : {};
    }
  );

  const handleQuantityChange = (itemName: string, quantity: number) => {
    setBasketItems((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + quantity,
    }));
  };

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

  const uniqueCategories = [
    ...new Set(menu?.map((menuItem) => menuItem.category).filter(Boolean)),
  ];
  const filteredMenu =
    selectedCategory && selectedCategory !== "All"
      ? menu?.filter((item) => item.category === selectedCategory)
      : menu;

  return (
    <div>
      <div className="p-6 max-w-[60rem]">
        <h3 className="text-xl font-semibold mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-md ${selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All
          </button>
          {uniqueCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center px-6 my-10">
          {filteredMenu?.map((menuItem) => (
            <MenuCard
              key={menuItem.id}
              name={menuItem.title}
              price={menuItem.price}
              category={menuItem.category ?? "Uncategorized"}
              description={menuItem.description ?? "No description available"}
              quantity={basketItems[menuItem.title] || 0}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </section>
        <Basket
          setBasketItems={setBasketItems}
          items={basketItems}
          menu={menu}
        />
      </div>
    </div>
  );
};

export default Menu;
