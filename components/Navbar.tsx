import Image from "next/image";
import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

import imgSrc from "@/public/logo.png";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-[#0B3542] font-outfit py-3 px-5 lg:px-10">
      <ul className="hidden lg:flex justify-between items-center text-white">
        <li className="cursor-pointer text-lg mr-14 xl:mr-20 2xl:mr-28">
          About us
        </li>
        <li className="cursor-pointer text-lg mr-14 xl:mr-20 2xl:mr-28">
          Our dishes
        </li>
        <li className="cursor-pointer text-lg hidden xl:block mr-20 2xl:mr-28">
          Our dishes
        </li>
      </ul>
      <Image
        className="w-[100px] lg:w-[150px] xl:w-[170px]"
        src={imgSrc}
        alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
        priority
      />
      <ul className="hidden sm:flex justify-between items-center text-white">
        <li className="cursor-pointer block lg:hidden xl:block ml-20 2xl:ml-28 text-lg">
          Our dishes
        </li>
        <li className="cursor-pointer ml-9 md:ml-14 xl:ml-20 2xl:ml-28 md:text-lg">
          Where to find us
        </li>
        <li className="cursor-pointer bg-[#C35E48] font-semibold ml-9 md:ml-14 xl:ml-20 2xl:ml-28 px-5 py-1 rounded-none rounded-r-2xl">
          Sign up
        </li>
      </ul>
      <RxHamburgerMenu className="text-[#C35E48] text-3xl sm:hidden cursor-pointer" />
    </nav>
  );
};

export default Navbar;
