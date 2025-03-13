import Image from "next/image";
import Link from "next/link";
import React from "react";

import bilimoria from "@/public/bilimoria.png";

const RestaurantCard = ({ name, id }: { name: string; id: number }) => {
  const handleRestaurantClick = async () => {
    await fetch(`/api/cameFromMap?restaurantId=${id}`);
    window.location.href = `/restaurants/${id}`;
  };

  return (
    <article className="bg-white w-72 p-3 rounded-md cursor-pointer">
      <Link href={`/restaurants/${id}`} onClick={() => handleRestaurantClick()}>
        <Image
          className="w-full rounded-md"
          src={bilimoria}
          alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
          priority
        />
        <p>{name}</p>
      </Link>
    </article>
  );
};

export default RestaurantCard;
