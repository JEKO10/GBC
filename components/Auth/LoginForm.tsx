import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

import FormSuccess from "./FormSuccess";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = useMemo(() => {
    return searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with another provider!"
      : "";
  }, [searchParams]);
  const [isTwoFactor, setIsTwoFactor] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

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
      setSuccess("");
      setError("");

      startTransition(() => {
        login(values, callbackUrl).then(async (data) => {
          if (data?.error) {
            form.resetField("password");
            setError(data?.error);
          }

          if (data?.twoFactor) {
            setIsTwoFactor(true);
          }

          if (data?.success) {
            setSuccess(data.success);
            await update();

            router.push(data.callbackUrl || "/profile");
          }
        });
      });
    },
    [form, update, router, callbackUrl]
  );

  return (
    <section className="mb-10">
      <Form label="Log in">
        <form
          className="flex items-start justify-center flex-col bg-secondary mt-2 px-5 sm:px-8 pt-7 pb-5 rounded-lg"
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
                placeholder="example@example.com"
                icon={<MdAlternateEmail />}
              />
              <p className="text-body mt-0.5 mb-2">
                {errors.email?.message ?? ""}
              </p>
              <FormField
                label="Password"
                type="password"
                registration={register("password")}
                placeholder="******"
                icon={<LuDoorClosed />}
              />
              <p className="text-body mt-0.5 mb-2">
                {errors.password?.message ?? ""}
              </p>
            </>
          )}
          <div className="flex flex-col mt-5">
            <Link
              href="/auth/reset"
              className="text-md italic font-medium text-primary underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/register"
              className="text-md italic font-medium text-primary underline"
            >
              Create a new account
            </Link>
          </div>
          <button
            type="submit"
            className="flex items-center justify-between bg-primary mt-3 mb-3 w-full text-white text-lg py-2 px-3 rounded-md transition hover:bg-primary/65"
            disabled={isPending}
          >
            <span className="text-sm font-medium">
              {isTwoFactor ? "Confirm" : isPending ? "Loging in..." : "Log in"}
            </span>
            <LuDoorOpen />
          </button>
          <div className="text-center w-full">
            {success ? (
              <FormSuccess message={success} />
            ) : (
              <FormError message={error || urlError} />
            )}
          </div>
        </form>
      </Form>
      <Social />
    </section>
  );
};

export default LoginForm;
