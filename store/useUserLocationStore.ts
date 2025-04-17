import { create } from "zustand";

interface UserLocationState {
  coords: { lat: number; lng: number } | null;
  address: string;
  // eslint-disable-next-line no-unused-vars
  setCoords: (coords: { lat: number; lng: number }) => void;
  // eslint-disable-next-line no-unused-vars
  setAddress: (address: string) => void;
}

export const useUserLocationStore = create<UserLocationState>((set) => ({
  coords:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userLocation") || "null")
      : null,
  address:
    typeof window !== "undefined"
      ? localStorage.getItem("userAddress") || ""
      : "",
  setCoords: (coords) => {
    localStorage.setItem("userLocation", JSON.stringify(coords));
    set({ coords });
  },
  setAddress: (address) => {
    localStorage.setItem("userAddress", address);
    set({ address });
  },
}));
