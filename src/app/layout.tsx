import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Web3Modal } from "@/context/Web3Modal";
import { ToastContainer } from "react-toastify";
import { GoogleTagManager } from "@next/third-parties/google";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  weight: ["100", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Insights",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="insights">
      <GoogleTagManager gtmId="G-MY76XRM7G6" />
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </head>
      <body className={roboto.className + " flex w-full min-h-screen flex-col items-center pt-12 md:pt-14"}>
        <Web3Modal>
          <Header />
          <main className="w-full max-w-5xl px-2 py-2">{children}</main>
        </Web3Modal>
        <ToastContainer />
        {/*<div className="fixed bottom-0 z-50 w-full max-w-5xl px-2 py-2">*/}
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
      </body>
    </html>
  );
}
