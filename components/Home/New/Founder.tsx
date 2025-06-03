import Image from "next/image";
import React from "react";

import FounderImg from "@/public/home/founder.png";

const Founder = () => {
  return (
    <article className="flex flex-col lg:flex-row justify-between items-center px-5 sm:px-28 py-16 text-primary font-outfit gap-8">
      <div className="lg:w-1/2">
        <h2 className="font-arvo text-3xl md:text-4xl font-semibold mb-4 md:mb-8">
          OUR FOUNDER
        </h2>
        <p className="text-lg md:text-xl leading-relaxed mb-4 md:mb-5">
          General Bilimoria’s son,{" "}
          <span className="italic">Lord Karan Bilimoria</span>, established GBC
          as a way to carry forward his father’s legacy.
        </p>
        <p className="text-lg md:text-xl leading-relaxed mb-4 md:mb-5">
          With GBC his mission is simple —
          <span className="font-semibold">
            {" "}
            only serve meals that General Billy would be proud of.
          </span>
        </p>
      </div>
      <div className="relative z-20 flex justify-center lg:justify-end w-full lg:w-1/2">
        <Image
          src={FounderImg}
          alt="General Faridoon Bilimoria standing with officers"
          className="w-full max-w-xs sm:max-w-md lg:max-w-lg"
          loading="lazy"
        />
      </div>
    </article>
  );
};

export default Founder;
