import Image from "next/image";
import React from "react";

import Footer from "@/components/Footer";
import Food from "@/components/Home/New/Food";
import Founder from "@/components/Home/New/Founder";
import GeneralStorySection from "@/components/Home/New/GeneralStory";
import PostCodeForm from "@/components/Home/New/PostCodeForm";
import ScrollingBanner from "@/components/Home/ScrollingBanner";
import Banner from "@/public/home/banner.png";
import BlueBanner from "@/public/home/blue-banner.png";
import HeroImg from "@/public/home/hero.jpg";
import OrangeBanner from "@/public/home/orange-banner.png";

const Home = () => {
  return (
    <>
      <section className="relative">
        <Image
          src={HeroImg}
          alt="Eat Like a General"
          className="w-full object-cover"
          priority
        />
      </section>
      <section className="relative bg-[#f7e4d7]">
        <div
          className="absolute inset-0 bg-center bg-contain opacity-5 pointer-events-none"
          style={{ backgroundImage: "url('/home/bg-yellow.png')" }}
        />
        <Image
          src={BlueBanner}
          alt="Eat Like a General"
          className="w-full object-cover"
          priority
        />
        <PostCodeForm />
        <Image
          src={OrangeBanner}
          alt="Eat Like a General"
          className="w-full object-cover"
          priority
        />
      </section>
      <section className="relative bg-[#f7e4d7]">
        <div
          className="absolute inset-0 bg-center bg-contain opacity-5 pointer-events-none"
          style={{ backgroundImage: "url('/home/bg-red.png')" }}
        />
        <Food />
      </section>
      <Image
        src={Banner}
        alt="Eat Like a General"
        className="w-full object-cover"
        priority
      />
      <section className="relative bg-[#f7e4d7]">
        <div
          className="absolute inset-0 bg-center bg-contain opacity-5 pointer-events-none"
          style={{ backgroundImage: "url('/home/bg-black.png')" }}
        />
        <GeneralStorySection />
      </section>
      <section className="relative bg-[#f7e4d7]">
        <Image
          src={OrangeBanner}
          alt="Eat Like a General"
          className="w-full object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-center bg-contain opacity-5 pointer-events-none"
          style={{ backgroundImage: "url('/home/bg-yellow.png')" }}
        />
        <Founder />
        <Image
          src={OrangeBanner}
          alt="Eat Like a General"
          className="w-full object-cover"
          priority
        />
      </section>
      <ScrollingBanner />
      <Footer />
    </>
  );
};

export default Home;
