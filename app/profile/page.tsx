"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { settings } from "@/actions/settings";
import FormField from "@/components/Auth/FormField";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsSchema } from "@/schemas/auth";

// TODO UPdate ne radi
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
    startTransition(() => {
      settings(formData)
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
          }

          if (data.success) {
            update();
            setMessage(data.success);
          }
        })
        .catch((error) => {
          console.error("Something went wrong!", error);
          setMessage("Something went wrong!");
        });
    });
  };

  return (
    <div className="flex flex-col gap-10">
      {user?.name}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Update name"
          type="text"
          registration={register("name")}
          placeholder="Update name"
        />
        {user?.isOAuth === false && (
          <>
            <FormField
              label="Update email"
              type="email"
              registration={register("email")}
              placeholder="Update email"
            />
            <FormField
              label="Password"
              type="password"
              registration={register("password")}
              placeholder="******"
            />
            <FormField
              label="New password"
              type="password"
              registration={register("newPassword")}
              placeholder="******"
            />
          </>
        )}
        <FormField
          label="Update phone nubmer"
          type="text"
          registration={register("phone")}
          placeholder="Update phone nubmer"
        />
        {/* TODO ROLE I 2FA */}
        {user?.isOAuth === false && (
          <FormField
            label="Two factor enabled"
            type="checkbox"
            registration={register("isTwoFactorEnabled")}
            placeholder=""
          />
        )}
        <button type="submit">Save</button>
        <div className="flex flex-col gap-10">
          <p>{message}</p> <p>{errors.password?.message}</p>{" "}
          <p>{errors.newPassword?.message}</p>
        </div>
      </form>
      {/* <button>Two factor auth {user?.isTwoFactorEnabled ? "ON" : "OFF"}</button> */}
    </div>
  );
};

export default ProfilePage;
