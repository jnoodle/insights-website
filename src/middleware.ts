import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "zh-CN", "zh-TW"],

  // Used when no locale matches
  defaultLocale: "en",
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
