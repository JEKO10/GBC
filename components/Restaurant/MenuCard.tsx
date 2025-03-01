import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa6";

import bilimoria from "@/public/bilimoria.png";

interface MenuCardProps {
  name: string;
  category: string | null;
  price: number;
  description: string | null;
  quantity: number;
  // eslint-disable-next-line no-unused-vars
  onQuantityChange: (name: string, quantity: number) => void;
}

const MenuCard = ({
  name,
  category,
  price,
  description,
  onQuantityChange,
}: MenuCardProps) => {
  return (
    <article className="bg-white w-72 p-3 rounded-md shadow-md flex flex-col h-full">
      <Image
        className="w-full rounded-md select-none"
        src={bilimoria}
        alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
        priority
      />
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-start flex-col mt-3 select-none">
          <p>{name}</p>
          <p>Category: {category}</p>
        </div>
        <p className="mt-5 select-none">{description}</p>
        <article className="flex justify-between items-start mt-5">
          <p>{price}£</p>
          <div className="flex justify-center items-center">
            <button
              onClick={() => onQuantityChange(name, 1)}
              className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-2"
            >
              <FaPlus />
            </button>
          </div>
        </article>
      </div>
    </article>
  );
};

export default MenuCard;
