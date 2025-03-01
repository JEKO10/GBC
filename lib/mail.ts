import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// @TODO base url domain
export const getEmailUrlWithToken = (token: string) => {
  return `${BASE_URL}/auth/new-verification?token=${encodeURIComponent(token)}`;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = getEmailUrlWithToken(token);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email!",
    html: `<p>Click <a href="${confirmLink}" target="_blank" rel="noopener noreferrer">here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password!",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA token: ${token}</p>`,
  });
};
