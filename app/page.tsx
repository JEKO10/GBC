import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div>
      <div className="flex gap-10">
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
        <Link href="/profile">profile</Link>
      </div>
    </div>
  );
};

export default Home;
