import Link from "next/link";
import React from "react";
import { MdCheckCircle } from "react-icons/md";

const SuccessPage = () => {
  return (
    <section className="flex justify-center items-center flex-col my-10">
      <MdCheckCircle className="w-[600px] h-[200px] text-secondary" />
      <h3 className="text-primary text-5xl">Success!</h3>
      <p className="my-5 mb-20 text-2xl">Payment was successful!</p>
      <Link
        href="/profile/orders"
        className="text-white bg-secondary font-semibold px-5 py-1 rounded-none rounded-r-2xl transition cursor-pointer hover:bg-primary"
      >
        View your orders
      </Link>
    </section>
  );
};

export default SuccessPage;
