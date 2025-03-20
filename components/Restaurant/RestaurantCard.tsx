import Image from "next/image";
import Link from "next/link";
import React from "react";

import bilimoria from "@/public/bilimoria.png";

const RestaurantCard = ({ name }: { name: string }) => {
  return (
    <article className="bg-white w-72 p-3 rounded-md cursor-pointer relative">
      <Link href={`/restaurants/${name}`}>
        <Image
          className="w-full rounded-md"
          src={bilimoria}
          alt="Restaurant Image"
          priority
        />
        <p>{name}</p>
      </Link>
    </article>
  );
};

export default RestaurantCard;
