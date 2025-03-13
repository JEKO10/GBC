import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <section className="text-center">
      <p className="text-2xl mt-10 mb-5">Nothing`s here!</p>
      <Link className="text-lg text-blue-500" href={"/"}>
        Go back to the home page
      </Link>
    </section>
  );
};

export default NotFound;
