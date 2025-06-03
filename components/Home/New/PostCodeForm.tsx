"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import Hot from "@/public/home/hot.png";

import OrderForm from "./OrderForm";
import OrderOptions from "./OrderOptions";

interface Suggestion {
  address: string;
  id: string;
}

const PostCodeForm = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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
    <section className="flex flex-col lg:flex-row justify-center items-center font-arvo w-full px-5 sm:px-16 lg:px-28 py-12 md:py-24 gap-10">
      <article className="flex-1 mb-10 lg:mb-0">
        <h2 className="text-[#FB521E] text-center lg:text-left text-4xl md:text-5xl xl:text-6xl font-bold">
          Eat like a General!
        </h2>
        <p className="text-center lg:text-left text-lg md:text-xl mt-5 mb-5">
          Enter a postcode to discover our restaurants near you!
        </p>
        <OrderForm
          containerRef={containerRef}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          query={query}
          setQuery={setQuery}
        />
        <OrderOptions />
      </article>
      <div className="flex justify-center lg:justify-end w-full lg:w-auto">
        <Image
          src={Hot}
          alt="Coming in Hot"
          className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg"
          priority
        />
      </div>
    </section>
  );
};

export default PostCodeForm;
