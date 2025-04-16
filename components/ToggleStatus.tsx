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
    <span
      className={`${isActive ? "bg-green-400" : "bg-red-400"} cursor-pointer`}
      onClick={handleClick}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
