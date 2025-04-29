import Image from "next/image";
import Link from "next/link";
import React from "react";

import Footer from "@/components/Footer";
import AvailableRestaurants from "@/components/Home/AvailableRestaurants";
import HeroForm from "@/components/Home/HeroForm";
import OrderOptions from "@/components/Home/OrderOptions";
import ScrollingBanner from "@/components/Home/ScrollingBanner";
import General from "@/public/aboutUs/general.png";
import HeroImg from "@/public/home/hero1.png";
import OrderImg from "@/public/home/hero2.png";

const Home = () => {
  return (
    <>
      <section className="font-outfit px-5 sm:px-8 my-5 md:my-10">
        <article className="flex flex-col lg:flex-row items-center gap-y-5 justify-between lg:px-5 xl:px-10 lg:mt-8 mb-16 md:mb-28 lg:mb-72 xl:mb-56">
          <HeroForm />
          <div className="hidden md:flex justify-center flex-1 mt-10 lg:mt-0">
            <Image
              src={HeroImg}
              alt="Hero Banner Burger"
              className="w-[400px] lg:w-[500px] xl:w-[600px] absolute top-48 right-0 object-cover"
              priority
            />
          </div>
        </article>
        <article className="mb-5 lg:mb-24 xl:mb-36">
          <AvailableRestaurants />
        </article>
        <article className="flex flex-col lg:flex-row items-center md:items-end gap-y-5 justify-between lg:px-5 xl:px-10 lg:mt-8 lg:mb-36">
          <div className="hidden md:flex justify-center flex-1 mt-10 lg:mt-0">
            <Image
              src={OrderImg}
              alt="Hero Banner Burger"
              className="w-[400px] lg:w-[500px] xl:w-[700px] absolute md:top-[65rem] lg:top-[65rem] left-0 object-cover"
              priority
            />
          </div>
          <OrderOptions />
        </article>
        <h2 className="text-secondary text-3xl sm:text-4xl font-semibold text-center mt-16 md:mt-24 mb-3 md:mb-10">
          Our Story
        </h2>
        <article className="px-4 text-gray-800 mb-10">
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            For generations, the Bilimoria name has been synonymous with
            resilience, leadership, and an unwavering passion for excellence.
            General Bilimoria’s Canteen (GBC) is not just a food delivery
            service – it is a tribute to this legacy, a testament to the belief
            that food is more than sustenance; it is comfort, connection, and
            heritage.
          </p>

          <p className="text-base sm:text-lg lg:text-xl mt-8 leading-relaxed">
            Lieutenant General Faridoon &quot;Billy&quot; Bilimoria, a decorated
            officer of the Indian Army, lived a life of discipline and duty. His
            years in the forces were marked by the hardships of training,
            fighting and the sacrifices of service, yet amidst the rigors of
            military life, he found solace in food. In every corner of the world
            where he was stationed, he discovered the power of a well-cooked
            meal to bring people together, to heal, and to provide a moment of
            respite from the challenges of life. From the bustling markets of
            India to the distant lands he travelled, he nurtured a deep
            appreciation for flavours that carried stories of history, culture,
            and tradition.
          </p>
          <div className="w-full my-8">
            <Image
              src={General}
              title="General Faridoon Bilimoria - The Inspiration Behind GBC"
              alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
              className="w-full lg:w-1/2 mx-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            Lord Karan Bilimoria, his son, inherited this love for food. After
            witnessing firsthand how food could be both a necessity and a source
            of joy, he envisioned a way to carry forward his father’s
            legacy—creating something that would bring people not just meals,
            but comfort and quality they could trust. Having founded Cobra Beer,
            he now brings this same commitment to excellence with General
            Bilimoria’s Canteen. GBC isn’t just about delivering meals – it is
            about delivering experiences that evoke warmth, nostalgia, and
            delight.
          </p>
        </article>
        <button className="w-full text-secondary font-semibold md:mb-5 hover:text-primary transition">
          <Link href={"/about"}>Continue reading about us...</Link>
        </button>
      </section>
      <ScrollingBanner />
      <Footer />
    </>
  );
};

export default Home;
