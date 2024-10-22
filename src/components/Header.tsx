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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.5 17.8811C3.46443 18.4143 10.4457 22.4386 15.41 19.337C20.3742 16.2353 20.1003 10.8916 20.1003 8.443C20.55 7.5009 21.5 7.02195 21.5 4.4719C20.5669 5.3339 19.6394 5.6272 18.7175 5.3518C17.8144 3.97478 16.5718 3.36573 14.9897 3.52467C12.6167 3.76307 11.7485 6.09125 12.004 9.10335C8.34495 10.9537 5.47575 7.762 3.99709 5.3518C3.50304 7.24995 3.02665 9.5288 3.99709 12.0497C4.64405 13.7303 6.19925 15.1512 8.6627 16.3123C6.16615 17.6654 4.11191 18.1883 2.5 17.8811Z"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                </svg>
              </Link>
            </li>
            {/*<li>*/}
            {/*  <Link href="#" target="_blank" className="px-3 md:px-4">*/}
            {/*    <Image src="/discord.svg" alt="Discord" width={24} height={24} priority />*/}
            {/*  </Link>*/}
            {/*</li>*/}
            <li>
              <Link href="https://docs.web3insights.news" target="_blank" className="px-2 md:px-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.5 18.5C3.5 14.6484 3.5 5.5 3.5 5.5C3.5 3.84315 4.84315 2.5 6.5 2.5H17.5V15.5C17.5 15.5 9.1163 15.5 6.5 15.5C4.85 15.5 3.5 16.8421 3.5 18.5Z"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.5 15.5C17.5 15.5 7.07685 15.5 6.5 15.5C4.84315 15.5 3.5 16.8432 3.5 18.5C3.5 20.1568 4.84315 21.5 6.5 21.5C7.60455 21.5 12.9379 21.5 20.5 21.5V3.5"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7 18.5H17"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="mailto:sq30labs@gmail.com" target="_blank" className="px-2 md:px-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 19.5H22V12V4.5H12H2V12V19.5Z" stroke="#1E3A59" stroke-width="2" stroke-linejoin="round" />
                  <path
                    d="M2 4.5L12 12L22 4.5"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 4.5H2V12"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 12V4.5H12"
                    stroke="#1E3A59"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Link>
            </li>
          </ul>
          <LocaleSwitcher />
          <div className="">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}
