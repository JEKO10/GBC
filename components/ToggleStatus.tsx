"use client";

import { updateRestaurantStatus } from "@/actions/restaurants";

export default function ToggleStatus({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) {
  const handleClick = async () => {
    await updateRestaurantStatus(id);
  };

  return (
    <div
      className={`text-center font-outfit text-xl text-white ${isActive ? "bg-green-400 text-black" : "bg-red-400"} px-5 rounded-sm cursor-pointer`}
      onClick={handleClick}
    >
      <p>{isActive ? "Active" : "Inactive"}</p>
    </div>
  );
}
