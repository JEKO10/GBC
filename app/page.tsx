import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SiDeliveroo, SiJusteat, SiUbereats } from "react-icons/si";

import ScrollingBanner from "@/components/ScrollingBanner";
import Food from "@/public/aboutUs/food.png";
import General from "@/public/aboutUs/general.png";
import Karan from "@/public/contact/karan.png";
import Office from "@/public/contact/office.png";
import Logo from "@/public/small-logo.png";

const Home = () => {
  return (
    <>
      <section className="font-outfit px-5 sm:px-8 md:px-16 my-5 sm:my-10">
        <h1 className="text-secondary text-2xl sm:text-3xl md:text-4xl font-semibold text-center my-8 sm:my-12 md:mb-20">
          Welcome to General Bilimoria&apos;s Canteen
        </h1>

        <h2 className="text-secondary text-3xl sm:text-4xl font-semibold text-center mt-16 md:mt-24 mb-10">
          Our Story
        </h2>
        <article className="px-4 text-gray-800 mb-44">
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
              className="w-full md:w-1/2 mx-auto rounded-lg shadow-xl"
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

        <h2 className="text-secondary text-3xl sm:text-4xl font-semibold text-center mt-16 md:mt-24 mb-10">
          Our Founder
        </h2>
        <article className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14 mb-44">
          <div className="lg:w-1/2">
            <p className="text-lg leading-relaxed mb-6">
              Lord Karan Bilimoria is a pioneering entrepreneur, philanthropist,
              and public leader who has always believed in innovation, quality,
              and cultural inclusivity. With General Bilimoria’s Canteen, he
              extends his passion for great dining experiences by offering a
              carefully curated selection of meals from top-rated restaurants.
            </p>
            <p className="text-lg leading-relaxed sm:mb-2">
              A trailblazer in business and public service, Lord Bilimoria made
              history as the first Zoroastrian Parsi to sit in the House of
              Lords. His academic background spans Osmania University, the
              University of Cambridge, and he is an alumnus through executive
              education at Cranfield, Harvard Business School and London
              Business School. As the former President of the Confederation of
              British Industry (CBI) and Chancellor of the University of
              Birmingham, and current Chair of the International Chamber of
              Commerce (ICC) UK, he has championed leadership, economic growth,
              and business excellence on a global stage. His vision for GBC is
              simple: to offer a trusted platform where people can enjoy
              high-quality meals from reputable kitchens, free from concerns
              about sourcing, transparency, or quality.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src={Karan}
              title="General Faridoon Bilimoria - The Inspiration Behind GBC"
              alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
              className="w-full h-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
        </article>

        <h2 className="text-secondary text-3xl sm:text-4xl font-semibold text-center mt-16 md:mt-24 mb-10">
          Who We Are
        </h2>
        <article className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          <div className="w-full md:w-1/2">
            <Image
              src={Office}
              title="General Faridoon Bilimoria - The Inspiration Behind GBC"
              alt="Lieutenant General Faridoon Bilimoria (center) standing in full ceremonial military uniform, flanked by two high-ranking officers."
              className="w-full h-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
          <div className="lg:w-1/2">
            <p className="text-lg leading-relaxed mb-6">
              At General Bilimoria’s Canteen, we believe that great food should
              be trustworthy, fresh, and delicious. That’s why we’ve taken the
              guesswork out of ordering by partnering exclusively with top-rated
              restaurants across a variety of cuisines. Whether you’re craving
              comforting classics, bold global flavours, or modern culinary
              innovations, GBC ensures that every meal is crafted with care and
              integrity.
            </p>
            <p className="text-lg leading-relaxed sm:mb-2">
              Unlike traditional food delivery platforms, we prioritise
              transparency and quality. We do not work with &quot;dark
              kitchens&quot;- every dish comes from an established, highly rated
              restaurant that meets our rigorous standards for hygiene and
              excellence. Our team personally verifies each restaurant to
              guarantee that the food you receive is prepared in a clean,
              professional, and reputable environment.
            </p>
            <p className="text-lg leading-relaxed sm:mb-2">
              At GBC, we are committed to offering more than just convenience-
              we provide a food experience rooted in trust, heritage, and
              uncompromising quality. When you choose GBC, you’re choosing a
              service that values excellence in every bite
            </p>
          </div>
        </article>

        <h2 className="text-secondary text-2xl sm:text-3xl font-semibold text-center mt-16 md:mt-24 mb-10 md:mb-14">
          Why Choose GBC?
        </h2>
        <article className="flex flex-col lg:flex-row items-start lg:items-center gap-7 lg:gap-14">
          <div>
            <ul className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl space-y-6 sm:space-y-8">
              <li>
                <span className="font-semibold">
                  1. Top-Rated Restaurants Only
                </span>
                <p>
                  We only partner with restaurants rated 4.0 or higher, ensuring
                  every meal meets our high standards for taste and quality.
                </p>
              </li>
              <li>
                <span className="font-semibold">2. No Dark Kitchens</span>
                <p>
                  Every meal is sourced from a verified, transparent kitchen -
                  no hidden locations or mystery providers.
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  3. Hygiene & Quality Assured
                </span>
                <p>
                  Our team personally inspects partner restaurants to maintain
                  the highest standards of cleanliness and food safety.
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  4. Trustworthy and Transparent
                </span>
                <p>
                  We do the research so you can order with confidence, knowing
                  exactly where your food comes from.
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  5. Fresh & Reliable Delivery
                </span>
                <p>
                  Enjoy meals that are not just convenient but crafted for great
                  taste and peace of mind.
                </p>
              </li>
            </ul>
          </div>
          <div className="w-full xl:w-1/2 mt-4">
            <Image
              src={Food}
              title="Traditional Indian Food at General Bilimoria’s Canteen"
              alt="An assortment of authentic Indian dishes from General Bilimoria's Canteen, featuring butter chicken, dal, chana masala, biryani, crispy samosas, pakoras, parathas, and flavorful chutneys, served on traditional enamel plates."
              className="w-full h-auto rounded-lg shadow-xl"
              loading="lazy"
            />
          </div>
        </article>
        <p className="uppercase text-center text-lg md:text-xl font-semibold mt-10 sm:mt-16 px-4 sm:px-0">
          <span className="text-secondary">
            At GBC, <br />
          </span>
          quality is our priority- every meal, every time.
        </p>
        <article className="flex justify-center items-center flex-col w-full mt-16 md:mt-20 mb-24 md:px-10">
          <p className="uppercase text-secondary font-bold text-center text-2xl sm:text-3xl mb-5 lg:mb-10">
            Order now on
          </p>
          <div className="flex justify-center items-center gap-16">
            <a
              href="https://www.just-eat.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiJusteat className="text-[#FF8000] text-4xl lg:text-6xl cursor-pointer" />
            </a>
            <a
              href="https://www.ubereats.com/gb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiUbereats className="text-[#3FC060] text-4xl lg:text-6xl cursor-pointer" />
            </a>
            <a
              href="https://www.deliveroo.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiDeliveroo className="text-[#00CDBC] text-4xl lg:text-6xl cursor-pointer" />
            </a>
          </div>
          <p className="uppercase text-secondary font-bold text-center text-md mt-5 mb-1">
            Or
          </p>
          <div>
            <Link
              href="/map"
              className="flex justify-center items-center flex-col"
            >
              <Image
                className="w-[170px] sm:w-[200p] mb-2 cursor-pointer"
                src={Logo}
                alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
                priority
              />
              <button className="text-lg sm:text-2xl text-white bg-secondary font-semibold px-5 sm:px-8 py-2 rounded-none rounded-r-2xl transition cursor-pointer hover:bg-primary">
                Order directly from GBC
              </button>
            </Link>
          </div>
        </article>
      </section>
      <ScrollingBanner />
    </>
  );
};

export default Home;
