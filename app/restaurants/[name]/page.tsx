import Link from "next/link";
import React from "react";

import { getRestaurantWithMenu } from "@/actions/restaurants";
import Menu from "@/components/Restaurant/Menu";
import ReviewsWrapper from "@/components/Reviews/ReviewsWrapper";

const SingleRestaurantPage = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
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
      <h2 className="text-3xl font-bold pt-10 px-4 lg:px-14 text-center lg:text-left">
        {restaurant.name}
      </h2>
      <p className="my-5 md:my-2 px-4 lg:px-14">{restaurant.address}</p>
      <p className="px-4 md:px-14 text-secondary">
        Estimated order time 30-45 mins
      </p>
      <Menu menu={restaurant?.menus} />
      <ReviewsWrapper restaurantId={restaurant.id} />
    </div>
  );
};

export default SingleRestaurantPage;

// @TODO check
export const revalidate = 60;
