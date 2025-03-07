import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LuDoorClosed, LuDoorOpen } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import * as z from "zod";

import { login } from "@/actions/login";
import Form from "@/components/Auth/Form";
import FormError from "@/components/Auth/FormError";
import FormField from "@/components/Auth/FormField";
import Social from "@/components/Auth/Socials";
import { LoginSchema } from "@/schemas/auth";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = useMemo(() => {
    return searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with another provider!"
      : "";
  }, [searchParams]);
  const [isTwoFactor, setIsTwoFactor] = useState(false);
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

  const onSubmit = useCallback(
    async (values: z.infer<typeof LoginSchema>) => {
      setMessage("");

      startTransition(() => {
        login(values)
          .then((data) => {
            if (data?.error || data?.success) {
              form.reset();
              setMessage(data?.error ?? data?.success);
            }

            if (data?.twoFactor) {
              setIsTwoFactor(true);
            }
          })
          .catch(() => setMessage("Something went wrong!"));
      });
    },
    [form]
  );

  return (
    <div>
      <Form label="Log in">
        <form
          className="flex items-start justify-center flex-col bg-secondary mt-2 px-5 sm:px-8 pt-7 pb-5 rounded-lg [&>p]:-mt-2 [&>p]:mb-3 [&>p]:text-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isTwoFactor ? (
            <FormField
              label="Two factor code"
              type="text"
              registration={register("code")}
              placeholder="123456"
              icon={<MdAlternateEmail />}
            />
          ) : (
            ""
          )}
          {!isTwoFactor && (
            <>
              <FormField
                label="E-mail"
                type="email"
                registration={register("email")}
                placeholder="Unesi e-mail adresu"
                icon={<MdAlternateEmail />}
              />
              <p>{errors.email?.message ?? ""}</p>
              <FormField
                label="Password"
                type="password"
                registration={register("password")}
                placeholder="Unesi šifru"
                icon={<LuDoorClosed />}
              />
              <p>{errors.password?.message ?? ""}</p>
            </>
          )}
          <button className="text-md italic font-medium text-primary underline -mt-1 mb-5">
            <Link href="/auth/reset">Forgot password?</Link>
          </button>
          <Link
            href="/auth/register"
            className="text-md italic font-medium text-primary underline -mt-1"
          >
            Create a new account
          </Link>
          <button
            type="submit"
            className="flex items-center justify-between bg-primary mt-8 w-full text-white text-lg py-2 px-3 rounded-md transition hover:bg-primary/65"
            disabled={isPending}
          >
            <span className="text-sm font-medium">
              {isTwoFactor ? "Confirm" : isPending ? "Loging in..." : "Log in"}
            </span>
            <LuDoorOpen />
          </button>
          {/* {message && <p className="!mt-2 !text-white">{message}</p>} */}
          <FormError message={message || urlError} />
        </form>
      </Form>
      <Social />
    </div>
  );
};

export default LoginForm;
