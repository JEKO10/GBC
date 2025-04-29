"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { setUserAddress } from "@/actions/settings";
import { useUserLocationStore } from "@/store/useUserLocationStore";

const GETADDRESS_API_KEY = process.env.NEXT_PUBLIC_GETADDRESS_API_KEY!;

interface Suggestion {
  address: string;
  id: string;
}

const HeroForm = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const { setCoords, setAddress } = useUserLocationStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const value = e.target.value.toUpperCase();
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length < 4) {
      setSuggestions([]);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.getaddress.io/autocomplete/${encodeURIComponent(
            value
          )}?api-key=${GETADDRESS_API_KEY}`
        );
        const data = await response.json();

        if (data?.suggestions) {
          setSuggestions(
            data.suggestions.map((s: any) => ({
              address: s.address,
              id: s.id,
            }))
          );
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
        setErrorMessage("Failed to load suggestions. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleSelect = async (selected: Suggestion) => {
    setQuery(selected.address);
    setSuggestions([]);
    setAddress(selected.address);
    await setUserAddress(selected.address);

    try {
      const response = await fetch(
        `https://api.getAddress.io/get/${selected.id}?api-key=${GETADDRESS_API_KEY}`
      );
      const data = await response.json();

      if (data?.latitude && data?.longitude) {
        const coords = {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
        };
        setCoords(coords);
        router.push("/map");
      } else {
        console.error("No coordinates found in result");
      }
    } catch (err) {
      console.error("Address lookup failed:", err);
      setErrorMessage("Failed to retrieve address details. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedAddress = localStorage.getItem("userAddress");
    if (storedAddress) {
      setQuery(storedAddress);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full lg:max-w-3xl xl:max-w-4xl mt-5 md:mt-0 xl:mt-20"
    >
      <h2 className="text-center md:text-start text-3xl sm:text-3xl md:text-5xl xl:text-6xl font-bold text-primary">
        At <span className="text-secondary"> GBC, </span>
        quality is our priority-every meal, every time.
      </h2>
      <p className="text-start text-lg md:text-xl leading-6 mt-10 mb-3">
        Enter a postcode to discover our restaurants near you!
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErrorMessage(null);

          if (suggestions.length > 0) {
            await handleSelect(suggestions[0]);
          } else if (query.length >= 4) {
            router.push("/map");
          } else {
            setErrorMessage("Please enter a valid postcode.");
          }
        }}
        className="md:w-[45%] lg:w-2/3 xl:w-[70%] flex flex-col lg:flex-row gap-2 bg-white shadow-lg rounded-xl w-full p-2"
      >
        <input
          ref={inputRef}
          value={query}
          disabled={loading}
          onChange={handleInputChange}
          type="text"
          placeholder="E.G. EC4R 3TE"
          className="lg:text-xl flex-grow px-4 py-3 text-gray-700 focus:outline-none uppercase rounded-md sm:rounded-l-md sm:rounded-r-none border border-gray-300"
        />
        <button
          type="submit"
          className="bg-secondary text-white px-6 py-3 font-semibold hover:bg-primary transition rounded-md sm:rounded-r-md sm:rounded-l-none"
        >
          Order now
        </button>
      </form>

      {loading && (
        <div className="absolute top-full mt-1 w-full bg-white text-gray-600 text-sm px-4 py-2 border border-gray-200 shadow z-10 rounded-md">
          Loading suggestions...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 w-full md:w-[45%] lg:w-[65%] xl:w-[60%] max-h-[160px] bg-white shadow-lg z-10 rounded-md overflow-y-auto border border-gray-200">
          {suggestions.map((sugg, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(sugg)}
            >
              {sugg.address}
            </li>
          ))}
        </ul>
      )}

      {errorMessage && (
        <div className="font-outfit mt-2 px-4 py-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default HeroForm;
