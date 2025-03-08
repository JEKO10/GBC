export const publicRoutes = [
  "/",
  //   "/about",
  //   "/contact",
  //   "/faq",
  "/auth/login",
  "/auth/register",
  "/auth/new-verification",
  "/api/cron",
];

export const authRoutes = [
  "/auth/register",
  "/auth/login",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/profile";
