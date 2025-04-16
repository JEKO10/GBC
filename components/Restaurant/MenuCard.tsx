import Image from "next/image";
import React from "react";
import { FaPlus } from "react-icons/fa6";

interface MenuCardProps {
  name: string;
  category: string | null;
  price: number;
  description: string | null;
  image: string | null;
  quantity: number;
  // eslint-disable-next-line no-unused-vars
  onQuantityChange: (name: string, quantity: number) => void;
}

const MenuCard = ({
  name,
  category,
  price,
  description,
  image,
  onQuantityChange,
}: MenuCardProps) => {
  const imageSrc =
    image && image !== "null"
      ? `/menus/${image}`
      : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg";

  return (
    <article className="bg-white w-full rounded-xl shadow-md flex flex-col h-full overflow-hidden transition hover:scale-[1.01]">
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={`Image of ${name} - ${description || "a menu item"} from General Bilimoria's Canteen`}
          fill
          className="object-cover select-none"
          priority
        />
      </div>

      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">Category: {category}</p>
          <p className="text-sm text-gray-700 line-clamp-3">{description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t-2 border-gray pt-2">
          <span className="text-base font-bold text-gray-800">{price}£</span>
          <button
            onClick={() => onQuantityChange(name, 1)}
            className="cursor-pointer bg-secondary text-white px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-secondary-dark"
          >
            <FaPlus className="text-sm" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuCard;
