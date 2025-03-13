import Link from "next/link";
import React from "react";

const RestaurantsPage = async () => {
  return (
    <div>
      <h2>You cannot change url by yourself!</h2>
      <Link
        className="text-blue-500 text-lg text-center my-20 block"
        href={"/map"}
      >
        Discover restaurants near you!
      </Link>
    </div>
  );
};

export default RestaurantsPage;
