// useUserLocationStore.ts
import { create } from "zustand";

interface UserLocationState {
  coords: { lat: number; lng: number } | null;
  address: string;
  // eslint-disable-next-line no-unused-vars
  setCoords: (coords: { lat: number; lng: number }) => void;
  // eslint-disable-next-line no-unused-vars
  setAddress: (address: string) => void;
  reset: () => void;
}

export const useUserLocationStore = create<UserLocationState>((set) => {
  let initialCoords = null;
  let initialAddress = "";

  if (typeof window !== "undefined") {
    try {
      const savedCoords = localStorage.getItem("userLocation");
      const savedAddress = localStorage.getItem("userAddress");
      if (savedCoords) initialCoords = JSON.parse(savedCoords);
      if (savedAddress) initialAddress = savedAddress;
    } catch {
      console.warn("Failed to load location/address from localStorage.");
    }
  }

  return {
    coords: initialCoords,
    address: initialAddress,
    setCoords: (coords) => {
      localStorage.setItem("userLocation", JSON.stringify(coords));
      set({ coords });
    },
    setAddress: (address) => {
      localStorage.setItem("userAddress", address);
      set({ address });
    },
    reset: () => {
      localStorage.removeItem("userAddress");
      localStorage.removeItem("userLocation");
      set({ address: "", coords: null });
    },
  };
});
