export const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/map",
  "/restaurants/:name",
];

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
  "/api/orders",
  "/api/orders/[orderId]",
  "/api/login",
  "/api/stripe",
  "/api/payments",
  "/api/google-pay",
  "/api/create-payment-intent",
  "/api/reverse-geocode",
];

export const DEFAULT_LOGIN_REDIRECT = "/profile";
