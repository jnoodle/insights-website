import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import "../globals.scss";
import { Header } from "@/components/Header";
import { Web3Modal } from "@/context/Web3Modal";
import { ToastContainer } from "react-toastify";
import { GoogleTagManager } from "@next/third-parties/google";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

// const roboto = Roboto({
//   weight: ["100", "400", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

const insightsFont = localFont({
  src: [
    {
      path: "../../../public/fonts/SVN-Gilroy Light.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/SVN-Gilroy Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/SVN-Gilroy Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "Insights",
//   description: "",
// };

// i18n metadata https://next-intl-docs.vercel.app/docs/environments/metadata-route-handlers
// @ts-ignore
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("DefaultTitle"),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="insights" suppressHydrationWarning={true}>
      <GoogleTagManager gtmId="G-MY76XRM7G6" />
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </head>
      <body className={insightsFont.className + " flex w-full min-h-screen flex-col items-center pt-12 lg:pt-24"}>
        <NextIntlClientProvider messages={messages}>
          <Web3Modal>
            <Header />
            <main className="w-full px-4 lg:px-8 py-8">{children}</main>
          </Web3Modal>
          <ToastContainer />
          {/*<div className="fixed bottom-0 z-50 w-full max-w-7xl px-2 py-2">*/}
          {/*  <coingecko-coin-price-marquee-widget*/}
          {/*    coin-ids="bitcoin,ethereum,binancecoin,solana"*/}
          {/*    currency="usd"*/}
          {/*    background-color="#ffffff"*/}
          {/*    locale="en"*/}
          {/*    font-color="#536471"*/}
          {/*  ></coingecko-coin-price-marquee-widget>*/}
          {/*</div>*/}
          {/*<Script src="https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js" />*/}
          {/*<div className="gtranslate_wrapper"></div>*/}
          {/*<Script id="gtranslate">{`window.gtranslateSettings = {"default_language":"xx","languages":["en","zh-CN","zh-TW","fr","de","ja","ko"],"native_language_names":true,"wrapper_selector":".gtranslate_wrapper","switcher_horizontal_position":"right"}`}</Script>*/}
          {/*<Script src="https://cdn.gtranslate.net/widgets/latest/float.js" defer></Script>*/}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
