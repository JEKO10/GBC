import Link from "next/link";
import React from "react";

import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="flex gap-10">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/profile">profile</Link>
      </div>
    </div>
  );
};

export default Home;
