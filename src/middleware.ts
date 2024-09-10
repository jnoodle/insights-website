import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales, pathnames } from "@/config";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames,
  localeDetection: true,
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(zh-CN|zh-TW|en|es|fr|ja|ko|ru)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!api|v0|buzz|_next|_vercel|.*\\..*).*)",
  ],
};
export function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);

  // save invite code to cookie and redirect without invite code
  try {
    const url = request.nextUrl.clone();
    const params = new URLSearchParams(url.search);
    const inviteCode = params.get("i") || "";
    // console.log("url", url);
    // console.log("inviteCode", inviteCode);
    if (inviteCode) {
      params.delete("i");
      const redirectUri = url.origin + url.pathname + (params.size > 0 ? "?" + params.toString() : "");
      // console.log("search", params);
      // console.log("redirectUri", redirectUri);
      const newResponse = NextResponse.redirect(redirectUri);
      // store inviteCode
      newResponse.cookies.set("insights_invite_code", inviteCode, { maxAge: 60 * 60 * 24 * 365 });
      return newResponse;
    }
  } catch (e) {
    console.error(e);
  }
  return response;
}
