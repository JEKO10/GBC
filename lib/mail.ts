import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.gbcanteen.com";

const getEmailUrlWithToken = (token: string) => {
  return `${BASE_URL}/auth/new-verification?token=${encodeURIComponent(token)}`;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = getEmailUrlWithToken(token);

  await resend.emails.send({
    from: "hello@gbcanteen.com",
    to: email,
    subject: "Confirm your email!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <img src="https://www.gbcanteen.com/logo.png" alt="Logo" style="width: 220px; margin: 0 auto; display: block;" />
        <h2 style="color: #333;">Welcome to General Bilimoria’s Canteen!</h2>
        <p style="font-size: 16px; color: #555;">
          Please confirm your email address to complete your sign-up. We’re excited to have you on board!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${confirmLink}" style="background-color: #C35E48; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
            Confirm Email
          </a>
        </div>
        <p style="font-size: 14px; color: #aaa;">If you did not sign up, you can safely ignore this message.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${BASE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "hello@gbcanteen.com",
    to: email,
    subject: "Reset your password!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <img src="https://www.gbcanteen.com/logo.png" alt="Logo" style="width: 120px; margin: 0 auto; display: block;" />
        <h2 style="color: #333;">Reset your password</h2>
        <p style="font-size: 16px; color: #555;">
          It looks like you requested a password reset. Click the button below to set a new password.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${confirmLink}" style="background-color: #f44336; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #aaa;">If you didn’t request this, please ignore this email.</p>
      </div>
    `,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "hello@gbcanteen.com",
    to: email,
    subject: "Your 2FA Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <img src="https://www.gbcanteen.com/logo.png" alt="Logo" style="width: 120px; margin: 0 auto; display: block;" />
        <h2 style="color: #333;">Your Two-Factor Authentication Code</h2>
        <p style="font-size: 16px; color: #555;">Use the following code to complete your login:</p>
        <div style="text-align: center; font-size: 24px; margin: 20px 0; font-weight: bold; color: #0070f3;">
          ${token}
        </div>
        <p style="font-size: 14px; color: #aaa;">This code expires in 10 minutes. If you did not try to log in, please secure your account.</p>
      </div>
    `,
  });
};
