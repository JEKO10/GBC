import React from "react";

import RestaurantCard from "../Map/RestaurantCard";

const AvailableRestaurants = () => {
  return (
    <div className="font-outfit">
      <h3 className="text-start md:text-center uppercase text-secondary text-xl sm:text-3xl md:text-2xl">
        Now avalible on our website
      </h3>
      <div className="flex flex-wrap gap-10 justify-center mt-5">
        <RestaurantCard
          cuisine="Indian"
          name="General Bilimoria's Canteen - Sawbridgeworth"
        />
        <RestaurantCard
          cuisine="Indian"
          name="General Bilimoria's Canteen - St. Albans AL3 (Indian)"
        />
      </div>
    </div>
  );
};

export default AvailableRestaurants;
