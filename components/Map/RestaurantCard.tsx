import Image from "next/image";
import Link from "next/link";
import React from "react";

import Bilimoria from "@/public/bilimoria.png";

interface RestaurantCardProps {
  name: string;
  cuisine?: string;
  estimatedTime?: string;
}

const RestaurantCard = ({
  name,
  cuisine,
  estimatedTime = "Estimated order time 30–45 mins",
}: RestaurantCardProps) => {
  return (
    <article className="bg-white w-72 p-4 rounded-md cursor-pointer relative shadow-md">
      <Link href={`/map`}>
        <Image
          className="w-full rounded-md"
          src={Bilimoria}
          alt="Restaurant Image"
          priority
        />
        <div>
          <h4 className="text-lg font-semibold my-2">{name}</h4>
          <p className="text-sm text-secondary mb-1">{estimatedTime}</p>
          <p className="text-sm text-gray-600">
            Cuisine: {cuisine ? cuisine : "Unknown"}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default RestaurantCard;
