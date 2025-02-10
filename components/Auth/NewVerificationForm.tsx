"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { newVerification } from "@/actions/newVerification";

import FormError from "./FormError";

const NewVerificationForm = () => {
  const [message, setMessage] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (message) return;

    if (!token) {
      setMessage("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setMessage(data.success || data.error);
      })
      .catch(() => {
        setMessage("Something went wrong!");
      });
  }, [token, message]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div>
      <p>Confirming your verification...</p>
      {!message && <div className="loading"></div>}
      <FormError message={message} />
    </div>
  );
};

export default NewVerificationForm;
