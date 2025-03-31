"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LuDoorOpen } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import * as z from "zod";

import { newPassword } from "@/actions/newPassword";
import Form from "@/components/Auth/Form";
import FormError from "@/components/Auth/FormError";
import FormField from "@/components/Auth/FormField";
import { NewPasswordSchema } from "@/schemas/auth";

const NewPasswordForm = () => {
  const [message, setMessage] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setMessage("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setMessage(data?.success || data?.error);
      });
    });
  };

  return (
    <Form label="Forgot your password">
      <form
        className="flex items-start justify-center flex-col bg-secondary mt-2 px-5 sm:px-8 pt-7 pb-5 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label="Password"
          type="password"
          registration={register("password")}
          placeholder="Enter new password"
          icon={<MdAlternateEmail />}
        />
        <p className="text-body mt-0.5 mb-2">
          {errors.password?.message ?? ""}
        </p>
        <Link
          href="/auth/login"
          className="text-md italic font-medium text-primary underline mt-5"
        >
          Back to log in
        </Link>
        <button
          type="submit"
          className="flex items-center justify-between bg-primary mt-3 w-full text-white text-lg py-2 px-3 rounded-md transition hover:bg-primary/65"
          disabled={isPending}
        >
          <span className="text-sm font-medium">Reset password</span>
          <LuDoorOpen />
        </button>
        <FormError message={message} />
      </form>
    </Form>
  );
};

export default NewPasswordForm;
