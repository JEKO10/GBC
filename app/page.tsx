import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SiDeliveroo, SiJusteat, SiUbereats } from "react-icons/si";

import ScrollingBanner from "@/components/ScrollingBanner";
import food from "@/public/aboutUs/food.png";
import general from "@/public/aboutUs/general.png";

const Home = () => {
  return (
    <>
      <section className="font-outfit px-5 sm:px-8 md:px-16 my-5 sm:my-10">
        <h1 className="text-secondary text-2xl sm:text-3xl md:text-4xl font-semibold text-center my-8 sm:my-12 md:mb-20">
          Welcome to General Bilimoria&apos;s Canteen <br /> Authentic Indian
          Food with Quality Assurance
        </h1>
        <article className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          <div className="lg:w-1/2">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to General Bilimoria’s Canteen (GBC) – a food experience
              inspired by the legendary Lieutenant General Faridoon Bilimoria, a
              decorated officer of the Indian Army, whose legacy lives on
              through flavors that tell stories of courage, loyalty, and zest
              for life.
            </p>
            <p className="text-lg leading-relaxed sm:mb-2">
              As commander of the 2/5 Gorkha Rifles and the 15th General Officer
              Commander-in-Chief, Central Command, General Bilimoria –
              affectionately known as &quot;General Billy&quot; – was renowned
              not only for his leadership but also for his warmth, loyalty, and,
              of course, his love of good food. His journeys across the Indian
              subcontinent introduced him to a tapestry of flavors, textures,
              and spices that fueled his affection for the cuisine of the
              region.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <Image
              src={general}
              title="General Faridoon Bilimoria - The Inspiration Behind GBC"
              alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
              className="w-full h-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
        </article>
        <article>
          <h2 className="text-secondary text-2xl sm:text-3xl font-semibold text-center mt-16 md:mt-24 mb-10 md:mb-20">
            Explore our menus now
          </h2>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-around items-center w-full">
            <Link
              className="text-white text-xl bg-secondary font-semibold w-40 sm:w-auto text-center mb-5 sm:px-10 py-2 rounded-none rounded-r-2xl transition cursor-pointer hover:bg-primary"
              href="/auth/register"
            >
              Register
            </Link>
            <Link
              className="text-white text-xl bg-secondary font-semibold w-40 sm:w-auto text-center mb-5 sm:px-10 py-2 rounded-none rounded-r-2xl transition cursor-pointer hover:bg-primary"
              href="/auth/login"
            >
              Login
            </Link>
          </div>
        </article>
        <h2 className="text-secondary text-2xl sm:text-3xl font-semibold text-center mt-16 md:mt-24 mb-10 md:mb-20">
          Why Choose General Bilimoria’s Canteen for Authentic Indian Cuisine?
        </h2>
        <article className="flex flex-col lg:flex-row items-start lg:items-center gap-7 lg:gap-14">
          <div>
            <ul className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl space-y-6 sm:space-y-8">
              <li>
                <span className="font-semibold">1. Top-Rated Only</span>
                <p>
                  We only partner with restaurants rated 4.0 or higher, ensuring
                  every meal meets our high standards for taste and quality.
                </p>
              </li>
              <li>
                <span className="font-semibold">2. No Dark Kitchens</span>
                <p>
                  Every order comes from an established, transparent kitchen. No
                  mystery locations – only trusted, visible restaurants.
                </p>
              </li>
              <li>
                <span className="font-semibold">3. Clean and Verified</span>
                <p>
                  We personally check each restaurant’s hygiene and quality
                  practices, so you can order with confidence.
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  4. Trustworthy and Transparent
                </span>
                <p>
                  We research our partner restaurants so you can trust the
                  source of every meal, knowing it’s safe and fresh.
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  5. Freshly Delivered to Your Door
                </span>
                <p>
                  Enjoy meals that are not just convenient but crafted to
                  deliver great taste and peace of mind. At GBC, quality is our
                  priority – every meal, every time.
                </p>
              </li>
            </ul>
          </div>
          <div className="w-full xl:w-1/2 mt-4">
            <Image
              src={food}
              title="Traditional Indian Food at General Bilimoria’s Canteen"
              alt="An assortment of authentic Indian dishes from General Bilimoria's Canteen, featuring butter chicken, dal, chana masala, biryani, crispy samosas, pakoras, parathas, and flavorful chutneys, served on traditional enamel plates."
              className="w-full h-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
        </article>
        <p className="text-center text-lg md:text-xl font-semibold mt-10 sm:mt-20 px-4 sm:px-0">
          GBC PROMISE. <br />
          <span className="text-secondary">
            TRUST THE SOURCE, SAVOR THE TASTE.
          </span>
        </p>
        <article className="w-full mt-16 md:mt-28 mb-10 md:px-10">
          <p className="uppercase text-secondary font-bold text-center text-xl mb-5 lg:mb-10">
            Order now on
          </p>
          <div className="flex justify-around lg:justify-between items-center">
            <a
              href="https://www.just-eat.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiJusteat className="text-secondary text-4xl lg:text-6xl cursor-pointer" />
            </a>
            <a
              href="https://www.ubereats.com/gb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiUbereats className="text-secondary text-4xl lg:text-6xl cursor-pointer" />
            </a>
            <a
              href="https://www.deliveroo.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiDeliveroo className="text-secondary text-4xl lg:text-6xl cursor-pointer" />
            </a>
          </div>
        </article>
      </section>
      <ScrollingBanner />
    </>
  );
};

export default Home;
