"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { settings } from "@/actions/settings";
import FormField from "@/components/Auth/FormField";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsSchema } from "@/schemas/auth";

const ProfilePage = () => {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      phone: user?.phone || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (formData: z.infer<typeof SettingsSchema>) => {
    startTransition(async () => {
      try {
        const data = await settings(formData);
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

  return (
    <div className="flex flex-col gap-10">
      {/* {user?.name && <span>{user.name}</span>} */}
      <span>{user?.name ?? "No name available"}</span>
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
          label="Update phone nubmer"
          type="text"
          registration={register("phone", {
            minLength: {
              value: 6,
              message: "Must be at least 6 characters",
            },
          })}
          placeholder="Update phone nubmer"
          error={errors.phone}
        />
        {/* TODO ROLE  */}
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
          <p>{message}</p> <p>{errors.password?.message}</p>{" "}
          <p>{errors.newPassword?.message}</p>
        </div>
      </form>
      {/* <button>Two factor auth {user?.isTwoFactorEnabled ? "ON" : "OFF"}</button> */}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
