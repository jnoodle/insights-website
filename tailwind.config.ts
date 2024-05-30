import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        insights: {
          primary: "#1d9bf0",
          secondary: "#EFF3F4",
          accent: "#0F1419",
          neutral: "#536471",
          "base-100": "#eff3f4",
          "base-200": "#f7f7f7",
          error: "#EA3943",
          success: "#00aa6e",
        },
      },
    ],
  },
};
export default config;
