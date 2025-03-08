import db from "@/lib/db";

export const deleteExpiredTokens = async () => {
  try {
    const now = new Date();
    await db.verificationToken.deleteMany({
      where: {
        expires: { lt: now },
      },
    });
  } catch {
    return null;
  }
};
