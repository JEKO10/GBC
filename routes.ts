export const publicRoutes = [
  "/",
  //   "/about",
  //   "/contact",
  //   "/faq",
  "/auth/login",
  "/auth/register",
  "/auth/new-verification",
];

export const authRoutes = [
  // "/auth/register",
  // "/auth/login",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = ["/api/auth", "/api/cron"];

export const DEFAULT_LOGIN_REDIRECT = "/profile";
