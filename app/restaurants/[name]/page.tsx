import Link from "next/link";
import React from "react";

import { getRestaurantWithMenu } from "@/actions/restaurants";
import Menu from "@/components/Restaurant/Menu";

const SingleRestaurantPage = async ({
  params,
}: {
  params: { name: string };
}) => {
  const decodedName = decodeURIComponent(params.name);
  const restaurant = await getRestaurantWithMenu(decodedName);

  if (!decodedName || !restaurant || restaurant?.menus.length === 0) {
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
      <p className="px-14 text-secondary">Estimated order time 30-45 mins</p>
      <Menu menu={restaurant?.menus} />
    </div>
  );
};

export default SingleRestaurantPage;

// @TODO check
export const revalidate = 60;
