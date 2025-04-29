import Link from "next/link";
import React from "react";

const RestaurantsPage = async () => {
  return (
    <div>
      <h4 className="text-center mt-20 text-xl">
        You may only navigate to restaurant from
        <Link
          href="/map"
          className="text-blue-500 transition hover:text-secondary"
        >
          {" "}
          Map page!
        </Link>
      </h4>
      <Link
        className="text-secondary text-lg text-center my-10 block transition hover:text-blue-500"
        href={"/map"}
      >
        Discover restaurants near you!
      </Link>
    </div>
  );
};

export default RestaurantsPage;
