"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { settings } from "@/actions/settings";
import FormField from "@/components/Auth/FormField";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SettingsSchema } from "@/schemas/auth";

import FormError from "../Auth/FormError";
import FormSuccess from "../Auth/FormSuccess";

const ProfileForm = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      address: user?.address ?? "",
      password: "",
      newPassword: "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (formData: z.infer<typeof SettingsSchema>) => {
    setSuccess("");
    setError("");

    startTransition(async () => {
      try {
        const data = await settings(formData);

        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          setSuccess(data?.success);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong!"
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white shadow-md p-6 rounded-lg"
    >
      <FormField
        label="Update name"
        type="text"
        registration={register("name")}
        placeholder="Update name"
      />
      {user?.isOAuth === false && (
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
          <FormField
            label="Two-Factor Authentication"
            type="checkbox"
            registration={register("isTwoFactorEnabled")}
            error={errors.isTwoFactorEnabled}
          />
        </>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 bg-secondary text-white font-semibold rounded hover:bg-primary transition"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
      <div className="text-center w-full mt-5">
        {success ? (
          <FormSuccess message={success} />
        ) : (
          <FormError message={error} />
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
