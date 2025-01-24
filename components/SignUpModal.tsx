import Image from "next/image";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";

import Logo from "@/public/logo.png";

const SignUpModal = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <aside className="flex justify-center items-start bg-black/80 h-screen w-full">
      <article className="relative w-full md:w-1/2 xl:w-1/3 flex justify-center items-center flex-col bg-secondary text-center mt-10 mx-5 px-5 py-2 pb-5 rounded-md">
        <Image
          className="w-[250px]"
          src={Logo}
          alt="Logo for General Bilimoria's Canteen, featuring a vintage-style design with text reading 'GENERAL' curved at the top, 'BILIMORIA'S CANTEEN' in bold capital letters, and 'ESTD. 2023, LONDON, UK' at the bottom."
          priority
        />
        <p className="text-lg sm:text-xl md:text-lg font-outfit my-5 text-white max-w-full sm:max-w-[80%]">
          Subscribe to keep up to date on new dishes, giveaways & lots more!
        </p>
        <form className="flex justify-center items-center flex-col w-full md:w-3/4">
          <input
            type="text"
            className="bg-primary text-body outline-none placeholder-body text-lg tracking-wide w-full font-outfit px-3 py-2 my-2 border-2 border-transparent rounded-md focus:border-body focus:border-2"
            placeholder="Name..."
          />
          <input
            type="email"
            className="bg-primary text-body outline-none placeholder-body text-lg tracking-wide w-full font-outfit px-3 py-2 my-2 border-2 border-transparent rounded-md focus:border-body focus:border-2"
            placeholder="Email..."
          />
          <button className="bg-body font-outfit text-lg tracking-wide w-full my-2 px-3 py-2 rounded-md transition-colors hover:bg-primary hover:text-body">
            Submit
          </button>
        </form>
        <IoCloseOutline
          className="text-4xl text-body absolute top-3 right-3 cursor-pointer transition-colors hover:text-primary"
          onClick={() => setIsModalOpen(false)}
        />
      </article>
    </aside>
  );
};

export default SignUpModal;
