"use server";

import db from "@/prisma/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
};

// export const getUserByPhone = async (phone: string) => {
//   try {
//     const user = await db.user.findUnique({
//       where: { phone },
//     });

//     return user;
//   } catch {
//     return null;
//   }
// };

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};
