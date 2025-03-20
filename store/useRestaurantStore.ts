import { create } from "zustand";

import { Restaurant } from "@/app/map/page";

interface RestaurantStore {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  // eslint-disable-next-line no-unused-vars
  setRestaurants: (restaurants: Restaurant[]) => void;
  // eslint-disable-next-line no-unused-vars
  setFilteredRestaurants: (filtered: Restaurant[]) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [],
  filteredRestaurants: [],
  setRestaurants: (restaurants) =>
    set({ restaurants, filteredRestaurants: restaurants }),
  setFilteredRestaurants: (filtered) => set({ filteredRestaurants: filtered }),
}));
