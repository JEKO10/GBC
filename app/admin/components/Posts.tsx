import React from "react";

const Posts = () => {
  return (
    <article className="my-48">
      <h3 className="text-2xl">Add a post for a restaurant</h3>
      <form className="flex justify-center items-center flex-col mt-5 w-1/2 mx-auto">
        <input
          type="text"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Name of a dish..."
        />
        <textarea
          className="max-h-[500px] bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Description"
        />
        <input
          type="text"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Price (add £ after number)..."
        />
        <input
          type="number"
          className="bg-primary text-body outline-none placeholder-body text-md tracking-wide w-full font-outfit px-3 py-2 my-2 border-4 border-transparent rounded-md focus:border-secondary focus:border-4"
          placeholder="Restaurant"
        />
        <input
          type="file"
          name="images"
          multiple
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

export default Posts;
