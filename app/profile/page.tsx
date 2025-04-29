"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

import ProfileForm from "@/components/Reviews/ProfileForm";
import UserReviews from "@/components/Reviews/UserReviews";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserLocationStore } from "@/store/useUserLocationStore";

const ProfilePage = () => {
  const user = useCurrentUser();
  const { address } = useUserLocationStore();
  const [hydrated, setHydrated] = useState(false);
  const { reset } = useUserLocationStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <section className="font-outfit max-w-3xl mx-auto px-4 sm:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-secondary mb-6">
        Your Profile
      </h2>

      <article className="text-center mb-6">
        <p className="text-lg font-medium">
          {user?.name ?? "No name available"}
        </p>
        <p className="text-gray-600">{address ?? ""}</p>
      </article>
      <button className="py-2 px-4 bg-secondary text-white font-semibold rounded-tl-md rounded-tr-md hover:bg-primary transition">
        <Link href={"/profile/orders"}>View your orders</Link>
      </button>
      <ProfileForm />
      <div className="mt-10">
        <UserReviews />
      </div>
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            reset();
            signOut();
          }}
          className="text-red-500 font-medium hover:underline"
        >
          Sign Out
        </button>
      </div>
    </section>
  );
};

export default ProfilePage;
