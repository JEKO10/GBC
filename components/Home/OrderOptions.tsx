import React from "react";
import { SiDeliveroo, SiJusteat, SiUbereats } from "react-icons/si";

const OrderOptions = () => {
  return (
    <div className="flex-1 md:ml-20 xl:ml-56 mt-14 md:mt-24 lg:mt-14 xl:mt-0 max-w-xl">
      <p className="text-center md:text-end lg:text-start uppercase text-secondary text-xl sm:text-3xl md:text-2xl mb-5">
        Or order now on
      </p>
      <div className="flex justify-center md:justify-end lg:justify-start items-start gap-12">
        <a
          href="https://www.just-eat.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiJusteat className="text-[#FF8000] text-5xl lg:text-7xl xl:text-[7rem] cursor-pointer" />
        </a>
        <a
          href="https://www.ubereats.com/gb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiUbereats className="text-[#3FC060] text-5xl lg:text-7xl xl:text-[7rem] cursor-pointer" />
        </a>
        <a
          href="https://www.deliveroo.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiDeliveroo className="text-[#00CDBC] text-5xl lg:text-7xl xl:text-[7rem] cursor-pointer" />
        </a>
      </div>
      <p className="text-center md:text-end lg:text-start uppercase max-w-sm lg:max-w-full text-secondary text-xl sm:text-3xl md:text-2xl mt-4 mb-5 lg:mb-10">
        Questions? Call us at 07760423037
      </p>
    </div>
  );
};

export default OrderOptions;
