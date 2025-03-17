import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import bilimoria from "@/public/bilimoria.png";

const RestaurantCard = ({ name }: { name: string }) => {
  // @TODO middleware check
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRestaurantClick = async (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/cameFromMap?name=${encodeURIComponent(name)}`
      );
      if (!response.ok) throw new Error("Failed to set cookie");

      router.push(`/restaurants/${encodeURIComponent(name)}`);
    } catch (error) {
      console.error("Error setting cookie:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white w-72 p-3 rounded-md cursor-pointer relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}
      <a href={`/restaurants/${name}`} onClick={handleRestaurantClick}>
        <Image
          className="w-full rounded-md"
          src={bilimoria}
          alt="Restaurant Image"
          priority
        />
        <p>{name}</p>
      </a>
    </article>
  );
};

export default RestaurantCard;
