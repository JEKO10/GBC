import Link from "next/link";
import React from "react";

import { getRestaurantWithMenu } from "@/actions/restaurants";

const SingleRestaurantsPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const parsedId = Number(params.restaurantId);
  const invalidId = Number.isNaN(parsedId) || parsedId > 2147483647;
  const restaurant = invalidId ? null : await getRestaurantWithMenu(parsedId);

  if (invalidId || !restaurant || restaurant?.menus.length === 0) {
    return (
      <div className="text-center">
        <p className="my-10 text-4xl">There is no such restaurant!</p>
        <Link href="/restaurants" className="bg-white p-3 rounded-md">
          Go back to restaurants page
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl pt-14 px-14">{restaurant.name}</h2>
      <p className="px-14">{restaurant.address}</p>
      {/* <p className="text-xl p-14">Menu</p> */}
    </div>
  );
};

export default SingleRestaurantsPage;
