// import Link from "next/link";
// import React from "react";

import Link from "next/link";

// import { SiDeliveroo, SiJusteat, SiUbereats } from "react-icons/si";
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

// const SingleRestaurantPage = async ({
//   params,
// }: {
//   params: Promise<{ name: string }>;
// }) => {
//   const { name } = await params;
//   const decodedName = decodeURIComponent(name);
//   const restaurant = await getRestaurantWithMenu(decodedName);

//   if (!decodedName || !restaurant || restaurant?.menus.length === 0) {
//     return (
//       <div className="text-center">
//         <p className="my-10 text-4xl">There is no such restaurant!</p>
//         <Link href="/restaurants" className="bg-white p-3 rounded-md">
//           Go back to restaurants page
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center flex-col mb-20 px-5 lg:px-14">
//       <h2 className="text-3xl font-bold pt-14 text-center lg:text-left">
//         {restaurant.name}
//       </h2>
//       <p className="text-secondary font-semibold text-2xl mt-24 text-center lg:text-left">
//         You can find {restaurant.name} on:
//       </p>
//       <article className="flex justify-center lg:justify-start items-center gap-10 mt-5">
//         {restaurant.justEatUrl && (
//           <a
//             href={restaurant.justEatUrl || "https://www.just-eat.co.uk/"}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <SiJusteat className="text-[#FF8000] text-6xl lg:text-7xl cursor-pointer" />
//           </a>
//         )}
//         {restaurant.uberEatsUrl && (
//           <a
//             href={restaurant.uberEatsUrl || "https://www.ubereats.com/gb/"}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <SiUbereats className="text-[#3FC060] text-6xl lg:text-7xl cursor-pointer" />
//           </a>
//         )}
//         {restaurant.deliverooUrl && (
//           <a
//             href={restaurant.deliverooUrl || "https://www.deliveroo.co.uk/"}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <SiDeliveroo className="text-[#00CDBC] text-6xl lg:text-7xl cursor-pointer" />
//           </a>
//         )}
//       </article>
//       <p className="text-secondary font-semibold mt-16 text-center lg:text-left">
//         Direct ordering from our website — coming soon...
//       </p>
//     </div>
//   );
// };

// export default SingleRestaurantPage;
