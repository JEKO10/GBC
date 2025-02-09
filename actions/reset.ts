"use server";

import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas/auth";

export const reset = async (formData: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(formData);

  if (!validateFields.success) {
    return { error: "Invalid email!" };
  }
  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  // TODO ne pokazuje da ne postoji
  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};
