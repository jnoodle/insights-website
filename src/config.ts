import { Pathnames, LocalePrefix } from "next-intl/routing";

export const ironOptions = {
  cookieName: "insights-siwe",
  password: "z2P1qJYKXpDQLBWvtzvD2TNNo2DCVDxw",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const defaultLocale = "en" as const;
export const locales = ["en", "zh-CN", "zh-TW"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
};

export const localePrefix: LocalePrefix<typeof locales> = "always";