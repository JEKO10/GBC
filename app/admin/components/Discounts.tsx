import React from "react";

const Discounts = () => {
  return (
    <article className="mt-28">
      <h3 className="text-2xl">Add a discount</h3>
      <form className="flex justify-center items-center flex-col mt-5 w-1/2 mx-auto">
        <input
          type="text"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Name of a dish..."
        />
        <input
          type="text"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Discount (add % after number)..."
        />
        <input
          type="text"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Days active (e.g. 21.1. - 28.1.)..."
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
        />
        <button className="bg-secondary text-body font-outfit text-md tracking-wide w-full my-2 px-3 py-2 rounded-md transition-colors hover:bg-primary">
          Submit
        </button>
      </form>
    </article>
  );
};

export default Discounts;
