"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import Logo from "@/public/logo.png";

import SignUpModal from "./SignUpModal";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useCurrentUser();

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <>
      <nav className="flex justify-between items-center bg-primary font-outfit py-3 px-5 lg:px-10">
        <ul className="hidden lg:flex justify-between items-center text-white">
          <li className="cursor-pointer text-lg mr-14 xl:mr-20 2xl:mr-28 transition hover:text-secondary">
            <Link href="/about">About us</Link>
          </li>
          <li className="cursor-pointer text-lg mr-14 xl:mr-20 2xl:mr-28 transition hover:text-secondary">
            <Link href="/contact">Contact us</Link>
          </li>
        </ul>
        <Link href="/">
          <Image
            className="w-[100px] lg:w-[150px] xl:w-[170px] cursor-pointer"
            src={Logo}
            alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
            priority
          />
        </Link>
        <ul className="hidden sm:flex justify-between items-center text-white">
          <li className="hidden md:block lg:hidden cursor-pointer text-lg ml-9 xl:ml-20 2xl:ml-28 transition hover:text-secondary">
            About us
          </li>
          <li className="cursor-pointer ml-9 md:ml-14 xl:ml-20 2xl:ml-28 md:text-lg transition hover:text-secondary">
            <Link href="/map">Where to find us</Link>
          </li>
          {user ? (
            <li className="cursor-pointer ml-9 md:ml-14 xl:ml-20 2xl:ml-28 md:text-lg transition hover:text-secondary">
              <Link href="/profile">{user.name}</Link>
            </li>
          ) : (
            <li className="cursor-pointer bg-secondary font-semibold ml-9 md:ml-14 xl:ml-20 2xl:ml-28 px-5 py-1 rounded-none rounded-r-2xl transition hover:text-primary hover:bg-body">
              <Link href="/auth/register">Sign up</Link>
            </li>
          )}
        </ul>
        <RxHamburgerMenu className="text-secondary text-3xl sm:hidden cursor-pointer" />
      </nav>
      {isModalOpen && <SignUpModal setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default Navbar;
