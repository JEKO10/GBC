"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { newVerification } from "@/actions/newVerification";

import FormError from "./FormError";
import FormSuccess from "./FormSuccess";

const NewVerificationForm = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data?.success) {
          setSuccess(data.success);
        } else {
          setError("Something went wrong!");
        }
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  return (
    <div className="flex flex-col items-center bg-secondary text-white mt-10 px-5 sm:px-8 pt-7 pb-5 rounded-lg max-w-xl mx-auto shadow-md">
      <p className="mb-6 text-lg font-medium">
        {success || error
          ? "Verification Result"
          : "Confirming your verification..."}
      </p>
      {!error && !success && <div className="loading" />}
      <div className="w-full mt-5">
        {success && <FormSuccess message={success} />}
        {error && <FormError message={error} />}
      </div>
      <Link
        href="/auth/login"
        className="text-md italic font-medium text-primary underline mt-3"
      >
        Back to log in page
      </Link>
    </div>
  );
};

export default NewVerificationForm;
