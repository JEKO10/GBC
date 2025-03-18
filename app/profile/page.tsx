"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { settings } from "@/actions/settings";
import FormField from "@/components/Auth/FormField";
import UserReviews from "@/components/Reviews/UserReviews";
import parseAddress from "@/helpers/parseAddress";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsSchema } from "@/schemas/auth";

const ProfilePage = () => {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const user = useCurrentUser();
  const { houseNumber, address, postcode } = parseAddress(user?.address);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      houseNumber: houseNumber,
      address: address,
      postcode: postcode,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (formData: z.infer<typeof SettingsSchema>) => {
    const formattedAddress =
      formData.houseNumber && formData.address && formData.postcode
        ? `${formData.houseNumber} ${formData.address}, ${formData.postcode}`
        : "";

    startTransition(async () => {
      try {
        const data = await settings({
          ...formData,
          // phone: formattedPhone,
          address: formattedAddress,
        });
        setMessage(data.error ?? data.success);
        if (data.success) {
          update();
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Something went wrong!"
        );
      }
    });
  };

  // @TODO DB INDEXES
  return (
    <div className="flex flex-col gap-10">
      <span>{user?.name ?? "No name available"}</span>
      <span>{user?.address ?? ""}</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Update name"
          type="text"
          registration={register("name")}
          placeholder="Update name"
        />
        {user?.isOAuth === false ? (
          <>
            <FormField
              label="Email"
              type="email"
              registration={register("email", {
                required: "Email is required",
              })}
              placeholder="Enter your email"
              error={errors.email}
            />
            <FormField
              label="Password"
              type="password"
              registration={register("password", {
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
              })}
              placeholder="******"
              error={errors.password}
            />
            <FormField
              label="New password"
              type="password"
              registration={register("newPassword", {
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
              })}
              placeholder="******"
              error={errors.newPassword}
            />
          </>
        ) : null}
        <FormField
          label="House Number"
          type="text"
          registration={register("houseNumber")}
          placeholder="Enter your house number"
          error={errors.houseNumber}
        />
        <FormField
          label="Address"
          type="text"
          registration={register("address")}
          placeholder="Enter your street address"
          error={errors.address}
        />
        <FormField
          label="Postcode"
          type="text"
          registration={register("postcode")}
          placeholder="XXXX XXX"
          error={errors.postcode}
        />
        {user?.isOAuth === false ? (
          <FormField
            label="Two-Factor Authentication"
            type="checkbox"
            registration={register("isTwoFactorEnabled")}
            error={errors.isTwoFactorEnabled}
          />
        ) : null}
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
        <div className="flex flex-col gap-10">
          <p>{message}</p> <p>{errors.password?.message} </p>
          <p>{errors.newPassword?.message}</p>
        </div>
      </form>
      <UserReviews />
      {/* @TODO */}
      {/* <button>Two factor auth {user?.isTwoFactorEnabled ? "ON" : "OFF"}</button> */}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
