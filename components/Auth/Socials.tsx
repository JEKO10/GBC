"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {
  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div>
      <button
        onClick={() => onClick("google")}
        className="bg-white w-full border-primary py-1 rounded-sm mt-10"
      >
        <FcGoogle className="text-2xl text-center w-full" />
      </button>
      <button
        onClick={() => onClick("facebook")}
        className="bg-white w-full border-primary py-1 rounded-sm mt-10"
      >
        <FaSquareFacebook className="text-2xl text-center w-full" />
      </button>
    </div>
  );
};

export default Social;
