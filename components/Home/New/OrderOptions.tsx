import React from "react";
import { SiDeliveroo, SiJusteat, SiUbereats } from "react-icons/si";

const OrderOptions = () => {
  return (
    <>
      <article className="flex justify-center lg:justify-start items-center gap-10 lg:gap-7 my-8 ml-0 lg:ml-36 xl:ml-56">
        <a
          href="https://www.just-eat.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiJusteat className="text-[#FF8000] text-6xl lg:text-7xl cursor-pointer" />
        </a>
        <a
          href="https://www.ubereats.com/gb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiUbereats className="text-[#3FC060] text-6xl lg:text-7xl cursor-pointer" />
        </a>
        <a
          href="https://www.deliveroo.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiDeliveroo className="text-[#00CDBC] text-6xl lg:text-7xl cursor-pointer" />
        </a>
      </article>
      <p className="text-primary font-semibold text-xl sm:text-3xl mt-4 text-center lg:text-left">
        Questions? Call us at 07760423037
      </p>
    </>
  );
};

export default OrderOptions;
