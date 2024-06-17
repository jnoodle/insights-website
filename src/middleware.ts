import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales, pathnames } from "@/config";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames,
  localeDetection: false,
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(zh-CN|zh-TW|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!api|v0|buzz|_next|_vercel|.*\\..*).*)",
  ],
};
