"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LuDoorClosed, LuDoorOpen } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import * as z from "zod";

import { LoginSchema } from "@/schemas/auth";

import Form from "../components/Form";
import FormField from "../components/FormField";

const LoginPage = () => {
  const [message, setMessage] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      // logIn(values).then((data) => {
      //   setMessage(data?.error);
      // });
      console.log("Log in");
    });
  };

  return (
    <div>
      <Form label="Log in">
        <form
          className="flex items-start justify-center flex-col bg-secondary mt-2 px-5 sm:px-8 pt-7 pb-5 rounded-lg [&>p]:-mt-2 [&>p]:mb-3 [&>p]:text-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            label="E-mail"
            type="email"
            registration={register("email")}
            placeholder="Unesi e-mail adresu"
            icon={<MdAlternateEmail />}
          />
          <p>{errors.email?.message}</p>
          <FormField
            label="Password"
            type="password"
            registration={register("password")}
            placeholder="Unesi šifru"
            icon={<LuDoorClosed />}
          />
          <p>{errors.password?.message}</p>
          <Link
            href="/register"
            className="text-md italic font-medium text-primary underline -mt-1"
          >
            Create a new account
          </Link>
          <button
            type="submit"
            className="flex items-center justify-between bg-primary mt-8 w-full text-white text-lg py-2 px-3 rounded-md transition hover:bg-primary/65"
            disabled={isPending}
          >
            <span className="text-sm font-medium">Prijavi se</span>
            <LuDoorOpen />
          </button>
          {message && <p className="!mt-2 !text-white">{message}</p>}
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
