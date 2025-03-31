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
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={() => onClick("google")}
        className="bg-primary w-full border-primary py-2 rounded-md"
      >
        <FcGoogle className="text-2xl text-center w-full" />
      </button>
      <button
        onClick={() => onClick("facebook")}
        className="bg-primary w-full border-primary py-2 rounded-md"
      >
        <FaSquareFacebook className="text-2xl text-center w-full text-white" />
      </button>
    </div>
  );
};

export default Social;
