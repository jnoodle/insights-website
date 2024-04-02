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
          primary: "#FCFC03",
          secondary: "#A0C0FF",
          accent: "#20211E",
          neutral: "#8A8A8A",
          "base-100": "#090808",
          "base-200": "#2C3921",
          "base-300": "#414933",
          "base-content": "#8A8A8A",
        },
      },
    ],
  },
};
export default config;
