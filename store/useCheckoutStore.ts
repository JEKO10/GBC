import { create } from "zustand";

interface CheckoutItem {
  id: number;
  quantity: number;
}

interface CheckoutStore {
  items: CheckoutItem[];
  note: string;
  total: number;
  menu: {
    id: number;
    title: string;
    restaurant_id: number;
    category: string | null;
    price: number;
    description: string | null;
    imageUrl: string | null;
  }[];
  // eslint-disable-next-line no-unused-vars
  setCheckoutData: (data: {
    items: CheckoutItem[];
    note: string;
    total: number;
    menu: CheckoutStore["menu"];
  }) => void;
  clearCheckout: () => void;
}

const storageKey = "checkoutData";

export const useCheckoutStore = create<CheckoutStore>((set) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        set(parsed);
      } catch {
        console.warn("Failed to parse checkout data.");
      }
    }
  }

  return {
    items: [],
    note: "",
    total: 0,
    menu: [],
    setCheckoutData: ({ items, note, total, menu }) => {
      const newState = { items, note, total, menu };
      localStorage.setItem(storageKey, JSON.stringify(newState));
      set(newState);
    },
    clearCheckout: () => {
      localStorage.removeItem(storageKey);
      set({ items: [], note: "", total: 0, menu: [] });
    },
  };
});
