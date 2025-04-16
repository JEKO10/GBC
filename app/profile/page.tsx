"use client";

import { signOut } from "next-auth/react";
import React from "react";

import ProfileForm from "@/components/Reviews/ProfileForm";
import UserReviews from "@/components/Reviews/UserReviews";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ProfilePage = () => {
  const user = useCurrentUser();

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-secondary mb-6">
        Your Profile
      </h2>
      <article className="text-center mb-6">
        <p className="text-lg font-medium">
          {user?.name ?? "No name available"}
        </p>
        <p className="text-gray-600">{user?.address ?? ""}</p>
      </article>
      <ProfileForm />
      <div className="mt-10">
        <UserReviews />
      </div>
      <div className="mt-10 text-center">
        <button
          onClick={() => signOut()}
          className="text-red-500 font-medium hover:underline"
        >
          Sign Out
        </button>
      </div>
    </section>
  );
};

export default ProfilePage;
