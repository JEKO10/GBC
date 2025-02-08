"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LuDoorClosed, LuDoorOpen, LuPhone } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { PiUserLight } from "react-icons/pi";
import * as z from "zod";

import { RegisterSchema } from "@/schemas/auth";

import Form from "../components/Form";
import FormField from "../components/FormField";
import Social from "../components/Social";

const RegisterPage = () => {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      // registerAction(values).then((data) => {
      //   if (data.error) setMessage(data.error);
      //   if (data.success) {
      //     setMessage(data.success);
      //     setTimeout(() => {
      //       router.push("/login");
      //     }, 2000);
      //   }
      // });
      console.log("Register");
    });
  };

  return (
    <Form label="Napravi nalog">
      <form
        className="flex items-start justify-center flex-col bg-secondary mt-2 px-5 sm:px-8 pt-7 pb-5 rounded-lg [&>p]:-mt-2 [&>p]:mb-3 [&>p]:text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label="Name"
          type="text"
          registration={register("name")}
          placeholder="Enter your name"
          icon={<PiUserLight />}
        />
        <p>{errors.name?.message}</p>
        <FormField
          label="E-mail"
          type="email"
          registration={register("email")}
          placeholder="Enter your e-mail address"
          icon={<MdAlternateEmail />}
        />
        <p>{errors.email?.message}</p>
        <FormField
          label="Phone number"
          type="string"
          registration={register("phone")}
          placeholder="Enter your phone number"
          icon={<LuPhone />}
        />
        <p>{errors.phone?.message}</p>
        <FormField
          label="Password"
          type="password"
          registration={register("password")}
          placeholder="Password"
          icon={<LuDoorClosed />}
        />
        <p>{errors.password?.message}</p>
        <Link
          href="/login"
          className="text-md italic font-medium text-[#6eabda] underline -mt-1"
        >
          Sign in to an existing account
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
      <Social />
    </Form>
  );
};

export default RegisterPage;
