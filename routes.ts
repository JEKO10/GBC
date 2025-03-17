export const publicRoutes = ["/", "/about"];

export const authRoutes = [
  "/auth/register",
  "/auth/login",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/auth/new-verification",
];

export const apiAuthPrefix = [
  "/api/auth",
  "/api/cron",
  "/api/stripe",
  "/api/payments",
  "/api/google-pay",
  "/api/create-payment-intent",
];

export const DEFAULT_LOGIN_REDIRECT = "/profile";
