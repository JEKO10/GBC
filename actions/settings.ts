"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas/auth";

export const settings = async (formData: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized!" } as const;
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized!" } as const;
  }

  if (user.isOAuth) {
    formData.email = undefined;
    formData.password = undefined;
    formData.newPassword = undefined;
    formData.isTwoFactorEnabled = undefined;
  }

  if (formData.email && formData.email !== user.email) {
    const existingUser = await getUserByEmail(formData.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(formData.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success:
        "Verification email sent! If you can't find it, check spam folder!",
    };
  }

  if (formData.password && formData.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      formData.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPasswrod = await bcrypt.hash(formData.newPassword, 10);

    formData.password = hashedPasswrod;
  }

  // eslint-disable-next-line no-unused-vars
  const { newPassword, ...safeData } = formData;

  await db.user.update({
    where: { id: dbUser.id },
    data: safeData,
  });

  return { success: "Settings updated!" };
};

export const setUserPhoneNumber = async (phoneNumber: string | undefined) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized!" } as const;

  if (!phoneNumber) return { error: "No phone number!" } as const;

  try {
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized!" } as const;
    }

    if (dbUser.phone) {
      return { error: "Already has a phone number!" } as const;
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: { phone: phoneNumber },
    });
  } catch {
    return null;
  }
};

export const setUserGoogleAddress = async (
  googleAddress: string | undefined
) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized!" } as const;

  if (!googleAddress) return { error: "No google address!" } as const;

  try {
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized!" } as const;
    }

    if (dbUser.googleAddress) {
      return { error: "Already has a google address!" } as const;
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: { googleAddress },
    });
  } catch {
    return null;
  }
};

export const setUserAddress = async (googleAddress: string | undefined) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized!" } as const;

  if (!googleAddress) return { error: "No google address!" } as const;

  try {
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized!" } as const;
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: { address: googleAddress },
    });

    return { success: "Address updated!" } as const;
  } catch {
    return { error: "Failed to update address!" } as const;
  }
};
