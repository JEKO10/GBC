import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "rgba(var(--body))",
        primary: "rgba(var(--primary))",
        secondary: "rgba(var(--secondary))",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fade: "fade 1.5s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
