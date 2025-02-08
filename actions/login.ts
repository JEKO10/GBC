"use server";

import { AuthError } from "next-auth";
import * as z from "zod";

import { LoginSchema } from "@/schemas/auth";

export const login = async (formData: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(formData);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password } = validateFields.data;

  try {
    console.log(email, password);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Wrong credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
