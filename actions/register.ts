"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/schemas/auth";

import { getUserByEmail } from "../data/user";

export const register = async (formData: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(formData);

  if (!validateFields.success) {
    return { error: "Nevažeća polja!" };
  }

  const { name, email, password } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingEmail = await getUserByEmail(email);
  // const existingPhone = await getUserByPhone(phone);

  if (existingEmail) return { error: "E-mail address already in use!" };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation  email sent!" };
};
