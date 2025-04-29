import HCaptcha from "@hcaptcha/react-hcaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LuDoorClosed, LuDoorOpen } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { PiUserLight } from "react-icons/pi";
import * as z from "zod";

import { register as registerAction } from "@/actions/register";
import Form from "@/components/Auth/Form";
import FormField from "@/components/Auth/FormField";
import Social from "@/components/Auth/Socials";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";
import { RegisterSchema } from "@/schemas/auth";
import { useUserLocationStore } from "@/store/useUserLocationStore";

import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

const RegisterForm = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [captchaToken, setCaptchaToken] = useState("");
  const { reset } = useUserLocationStore();
  const isSmallScreen = useIsSmallScreen();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { register, handleSubmit, formState, setValue, trigger } = form;
  const { errors } = formState;

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setSuccess("");
    setError("");

    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    startTransition(() => {
      registerAction({ ...values, captchaToken }).then((data) => {
        if (data?.error) {
          setError(data?.error);
        }

        if (data?.success) {
          setSuccess(data?.success);

          reset();
        }
      });
    });
  };

  return (
    <section className="mb-10">
      <Form label="Sign up">
        <form
          className="flex items-start justify-center flex-col bg-secondary mt-2 px-5 sm:px-8 pt-7 pb-5 rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            {...register("nickname")}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />
          <FormField
            label="Name"
            type="text"
            registration={register("name")}
            placeholder="Jacob"
            icon={<PiUserLight />}
          />
          <p className="text-body mt-0.5 mb-2">{errors.name?.message}</p>
          <FormField
            label="E-mail"
            type="email"
            registration={register("email")}
            placeholder="example@example.com"
            icon={<MdAlternateEmail />}
          />
          <p className="text-body mt-0.5 mb-2">{errors.email?.message}</p>
          <FormField
            label="Password"
            type="password"
            registration={register("password")}
            placeholder="******"
            icon={<LuDoorClosed />}
          />
          <p className="text-body mt-0.5 mb-2">{errors.password?.message}</p>
          <FormField
            label="Confirm Password"
            type="password"
            registration={register("confirmPassword")}
            placeholder="Re-enter password"
            icon={<LuDoorClosed />}
          />
          <p className="text-body mt-0.5 mb-2">
            {errors.confirmPassword?.message}
          </p>
          <div className="w-full flex justify-center items-center">
            <HCaptcha
              size={isSmallScreen ? "compact" : "normal"}
              sitekey="5572ef8a-1ff8-4372-be86-dc464642d0e4"
              onVerify={(token) => {
                setCaptchaToken(token);
                setValue("captchaToken", token);
                trigger("captchaToken");
              }}
            />
          </div>
          <p className="text-body mt-0.5 mb-2">
            {errors.captchaToken?.message}
          </p>
          <Link
            href="/auth/login"
            className="text-md italic font-medium text-primary underline mt-3"
          >
            Sign in to an existing account
          </Link>
          <button
            type="submit"
            className="flex items-center justify-between bg-primary mt-3 w-full text-white text-lg py-2 px-3 rounded-md transition hover:bg-primary/65"
            disabled={isPending}
          >
            <span className="text-sm font-medium">
              {isPending ? "Signing up..." : "Sign up"}
            </span>
            <LuDoorOpen />
          </button>
          <div className="text-center w-full mt-5">
            {success ? (
              <FormSuccess message={success} />
            ) : (
              <FormError message={error} />
            )}
          </div>
        </form>
      </Form>
      <Social />
    </section>
  );
};

export default RegisterForm;
