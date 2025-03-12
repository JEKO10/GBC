import Link from "next/link";
import React from "react";

const RestaurantsPage = async () => {
  return (
    <div>
      <h2 className="text-4xl my-20 text-center">
        All of our restaurans in one place!
      </h2>
      <Link className="text-blue-500 text-lg text-center block" href={"/map"}>
        Discover restaurants near you!
      </Link>
    </div>
  );
};

export default RestaurantsPage;
