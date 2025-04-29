import React from "react";

const LoadingRestaurantPage = () => {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold">Loading restaurant...</h2>
      <p className="mt-2 text-gray-500">Please wait while we fetch the menu.</p>
      <div className="loading" />
    </div>
  );
};

export default LoadingRestaurantPage;
