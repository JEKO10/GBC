import React from "react";

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
    <div className="border shadow-md p-4 rounded-md w-64 text-center">
      <h4 className="text-lg font-semibold mb-2">{name}</h4>
      <p className="text-sm text-gray-600 mb-1">{estimatedTime}</p>
      <p className="text-sm text-gray-600">
        Cuisine: {cuisine ? cuisine : "Unknown"}
      </p>
    </div>
  );
};

export default RestaurantCard;
