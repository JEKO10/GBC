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
    return { error: "Invalid fields!" };
  }

  const { name, email, password, captchaToken, nickname } = validateFields.data;

  if (nickname) {
    return { error: "Bot detected. Registration blocked." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingEmail = await getUserByEmail(email);

  if (existingEmail) return { error: "E-mail address already in use!" };

  const captchaRes = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      response: captchaToken,
      secret: process.env.HCAPTCHA_SECRET!,
    }).toString(),
  });

  const captchaData = await captchaRes.json();
  if (!captchaData.success) {
    return { error: "Captcha verification failed. Please try again." };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success:
      "Confirmation email sent! If you can't find it, check spam folder!",
  };
};
