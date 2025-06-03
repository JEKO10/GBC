// import Image from "next/image";
// import React from "react";

// import FoodPlates from "@/public/home/food.png";

// const Food = () => {
//   return (
//     <article className="flex justify-between items-center px-5 sm:px-28 bg-[#DB5D44] text-body font-outfit">
//       <div className="lg:w-1/2">
//         <h2 className="text-4xl font-semibold mb-8">
//           GBC ISN&apos;T YOUR TYPICAL TAKEAWAY.
//         </h2>
//         <p className="text-xl leading-relaxed mb-5">
//           We&apos;ve handpicked the best dishes from the highest-rated
//           restaurants in your area.
//         </p>
//         <p className="text-xl leading-relaxed mb-5">
//           Every takeaway is tried, tasted, and held to the highest standards —
//           so you&apos;re guaranteed to{" "}
//           <span className="italic">Eat Like a General.</span>
//         </p>
//       </div>
//       <div className="relative z-20">
//         <Image
//           src={FoodPlates}
//           title="General Faridoon Bilimoria - The Inspiration Behind GBC"
//           alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
//           className="w-[500px]"
//           loading="lazy"
//         />
//       </div>
//     </article>
//   );
// };

// export default Food;

import Image from "next/image";
import React from "react";

import FoodPlates from "@/public/home/food.png";

const Food = () => {
  return (
    <article className="flex flex-col lg:flex-row justify-between items-center px-5 sm:px-16 lg:px-28 py-16 bg-[#DB5D44] text-body font-outfit gap-10">
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="font-arvo text-3xl sm:text-4xl font-semibold mb-6 lg:mb-8">
          GBC ISN&apos;T YOUR TYPICAL TAKEAWAY.
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed mb-4">
          We&apos;ve handpicked the best dishes from the highest-rated
          restaurants in your area.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed mb-4">
          Every takeaway is tried, tasted, and held to the highest standards —
          so you&apos;re guaranteed to{" "}
          <span className="italic">Eat Like a General.</span>
        </p>
      </div>
      <div className="relative z-20 flex justify-center lg:justify-end w-full lg:w-auto">
        <Image
          src={FoodPlates}
          alt="Various dishes served by GBC"
          className="w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl"
          loading="lazy"
        />
      </div>
    </article>
  );
};

export default Food;
