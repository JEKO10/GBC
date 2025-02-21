import db from "@/lib/db";
import { nullOnThrow } from "@/lib/nullOnThrow";

export const getVerificationTokenByToken = (token: string) =>
  nullOnThrow(() =>
    db.verificationToken.findUnique({
      where: { token },
    })
  );

export const getVerificationTokenByEmail = (email: string) =>
  nullOnThrow(() =>
    db.verificationToken.findFirst({
      where: { email },
    })
  );
