import React from "react";

const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-80 animate-pulse flex flex-col justify-between">
      <div className="bg-gray-200 h-32 rounded-md mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-8 bg-gray-300 rounded w-full mt-4" />
    </div>
  );
};

export default CardSkeleton;
