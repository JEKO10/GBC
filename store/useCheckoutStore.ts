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

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  items: [],
  note: "",
  total: 0,
  menu: [],
  setCheckoutData: ({ items, note, total, menu }) =>
    set({ items, note, total, menu }),
  clearCheckout: () => set({ items: [], note: "", total: 0, menu: [] }),
}));
