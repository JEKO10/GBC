import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LuDoorOpen } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import * as z from "zod";

import { reset } from "@/actions/reset";
import Form from "@/components/Auth/Form";
import FormError from "@/components/Auth/FormError";
import FormField from "@/components/Auth/FormField";
import { ResetSchema } from "@/schemas/auth";

const ResetPasswordForm = () => {
  const [message, setMessage] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setMessage("");

    startTransition(() => {
      reset(values).then((data) => {
        setMessage(data?.success || data?.error);
      });
    });
  };

  return (
    <Form label="Forgot your password">
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
        <Link
          href="/auth/login"
          className="text-md italic font-medium text-primary underline -mt-1"
        >
          Back to log in
        </Link>
        <button
          type="submit"
          className="flex items-center justify-between bg-primary mt-8 w-full text-white text-lg py-2 px-3 rounded-md transition hover:bg-primary/65"
          disabled={isPending}
        >
          <span className="text-sm font-medium">Send reset email</span>
          <LuDoorOpen />
        </button>
        <FormError message={message} />
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
