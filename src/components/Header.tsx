"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "@/components/ConnectButton";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/navigation";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const tNav = useTranslations("Nav");
  return (
    <div className="wrap flex items-center justify-center w-full bg-white h-24 top-0 z-50 fixed">
      <div className="header navbar w-full max-w-7xl px-2 py-1">
        <div className="navbar-start">
          <div className="btn btn-ghost p-0 hidden md:flex">
            <Link href="/" className="relative logo">
              <Image fill src="/insights-logo.svg" alt={t("Insights")} priority />
            </Link>
          </div>
          <div className="btn btn-ghost px-1 py-0 md:hidden">
            <Link href="/" className="relative w-6 h-6">
              <Image fill src="/insights-logo-icon.svg" alt={t("Insights")} priority />
            </Link>
          </div>
          <ul className="menu menu-horizontal">
            <li>
              <Link href={pathname === "/" ? "" : "/"} className={pathname === "/" ? "active-link" : ""}>
                {tNav("Home")}
              </Link>
            </li>
            <li>
              <Link
                href={pathname === "/predictions" ? "" : "/predictions"}
                className={pathname === "/predictions" ? "active-link" : ""}
              >
                {tNav("Predictions")}
              </Link>
            </li>
            <li>
              <Link
                href={pathname === "/tweets" ? "" : "/tweets"}
                className={pathname === "/tweets" ? "active-link" : ""}
              >
                {tNav("Tweets")}
              </Link>
            </li>
            <li>
              <Link href={pathname === "/news" ? "" : "/news"} className={pathname === "/news" ? "active-link" : ""}>
                {tNav("News")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <ul className="menu menu-horizontal px-0 text-sm items-center">
            <li>
              <Link href="https://x.com/insightsofweb3" target="_blank" className="px-2 md:px-4">
                <Image src="/twitter.svg" alt={t("Twitter")} width={20} height={20} priority />
              </Link>
            </li>
            {/*<li>*/}
            {/*  <Link href="#" target="_blank" className="px-3 md:px-4">*/}
            {/*    <Image src="/discord.svg" alt="Discord" width={20} height={20} priority />*/}
            {/*  </Link>*/}
            {/*</li>*/}
            <li>
              <Link href="https://docs.web3insights.news" target="_blank" className="px-2 md:px-4">
                <Image src="/docs.svg" alt={t("Whitepaper")} width={20} height={20} priority />
              </Link>
            </li>
            <li>
              <Link href="mailto:sq30labs@gmail.com" target="_blank" className="px-2 md:px-4">
                <Image src="/email.svg" alt={t("Contact")} width={20} height={20} priority />
              </Link>
            </li>
          </ul>
          <LocaleSwitcher />
          <div className="px-1 md:px-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}
