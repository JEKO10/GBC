"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { newVerification } from "@/actions/newVerification";

import FormError from "./FormError";

const NewVerificationForm = () => {
  const [message, setMessage] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <p>Confirming your verification...</p>
      {!message && <div className="loading"></div>}
      <FormError message={message} />
    </div>
  );
};

export default NewVerificationForm;
