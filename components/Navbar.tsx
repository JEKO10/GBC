"use client";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import Logo from "@/public/logo.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useCurrentUser();

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

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
          <li className="hidden md:block lg:hidden cursor-pointer text-lg ml-9 xl:ml-20 2xl:ml-28 transition hover:text-secondary">
            Contact us
          </li>
          <li className="hidden md:block cursor-pointer ml-9 xl:ml-20 2xl:ml-28 md:text-lg transition hover:text-secondary">
            <Link href="/map">Where to find us</Link>
          </li>
          {user ? (
            <li className="hidden md:block cursor-pointer ml-9 xl:ml-20 2xl:ml-28 md:text-lg transition hover:text-secondary">
              <Link href="/profile">{user.name}</Link>
            </li>
          ) : (
            <li className="cursor-pointer bg-secondary font-semibold ml-9 xl:ml-20 2xl:ml-28 px-5 py-1 rounded-none rounded-r-2xl transition hover:text-primary hover:bg-body">
              <Link href="/auth/register">Sign up</Link>
            </li>
          )}
        </ul>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-secondary text-3xl md:hidden cursor-pointer"
        >
          <RxHamburgerMenu />
        </button>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-primary z-40 flex flex-col py-3 px-5 text-white font-outfit animate-slide-in">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image className="w-[100px]" src={Logo} alt="Logo" priority />
            </Link>
            <button
              className="text-secondary text-4xl cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <IoClose />
            </button>
          </div>
          <nav className="flex flex-col text-center mt-5 gap-6 text-xl">
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              About us
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              Contact us
            </Link>
            <Link href="/map" onClick={() => setIsMobileMenuOpen(false)}>
              Where to find us
            </Link>
            {user ? (
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                {user.name}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-secondary mt-10 py-1 rounded-md font-semibold"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-secondary py-1 rounded-md font-semibold"
                >
                  Sign up
                </Link>
              </>
            )}
            {user ? (
              <button
                className="bg-secondary mt-10 py-1 rounded-md font-semibold"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              ""
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
