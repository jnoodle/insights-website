"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "@/components/ConnectButton";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const tNav = useTranslations("Nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { width: browserWidth } = useWindowSize();
  return (
    <>
      <div className="wrap flex items-center justify-center w-full bg-white h-16 lg:h-24 top-0 z-50 fixed">
        <div className="header navbar w-full px-2 py-1">
          <div className="navbar-start">
            <div className="p-0 flex">
              <Link href="/" className="relative logo lg:hover:scale-125 lg:transition-all">
                <Image fill src="/insights-logo.svg" alt={t("Insights")} priority />
              </Link>
            </div>
            <ul className="menu menu-horizontal hidden lg:flex">
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
            <ul className="menu menu-horizontal px-0 text-sm items-center hidden lg:flex">
              <li>
                <Link href="https://x.com/insightsofweb3" target="_blank" className="px-2 lg:px-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 17.8811C3.46443 18.4143 10.4457 22.4386 15.41 19.337C20.3742 16.2353 20.1003 10.8916 20.1003 8.443C20.55 7.5009 21.5 7.02195 21.5 4.4719C20.5669 5.3339 19.6394 5.6272 18.7175 5.3518C17.8144 3.97478 16.5718 3.36573 14.9897 3.52467C12.6167 3.76307 11.7485 6.09125 12.004 9.10335C8.34495 10.9537 5.47575 7.762 3.99709 5.3518C3.50304 7.24995 3.02665 9.5288 3.99709 12.0497C4.64405 13.7303 6.19925 15.1512 8.6627 16.3123C6.16615 17.6654 4.11191 18.1883 2.5 17.8811Z"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="https://docs.web3insights.news" target="_blank" className="px-2 lg:px-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.5 18.5C3.5 14.6484 3.5 5.5 3.5 5.5C3.5 3.84315 4.84315 2.5 6.5 2.5H17.5V15.5C17.5 15.5 9.1163 15.5 6.5 15.5C4.85 15.5 3.5 16.8421 3.5 18.5Z"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.5 15.5C17.5 15.5 7.07685 15.5 6.5 15.5C4.84315 15.5 3.5 16.8432 3.5 18.5C3.5 20.1568 4.84315 21.5 6.5 21.5C7.60455 21.5 12.9379 21.5 20.5 21.5V3.5"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 18.5H17"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="mailto:sq30labs@gmail.com" target="_blank" className="px-2 lg:px-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 19.5H22V12V4.5H12H2V12V19.5Z" stroke="#1E3A59" strokeWidth="2" strokeLinejoin="round" />
                    <path
                      d="M2 4.5L12 12L22 4.5"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 4.5H2V12"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 12V4.5H12"
                      stroke="#1E3A59"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
            <div className="justify-center py-2 mr-6 hidden lg:flex">
              <LocaleSwitcher />
            </div>
            <div className="hidden lg:block">{browserWidth && browserWidth >= 1024 && <ConnectButton />}</div>
            <label className="p-4 swap swap-rotate inline-grid lg:hidden">
              <input type="checkbox" checked={mobileMenuOpen} onChange={() => setMobileMenuOpen(!mobileMenuOpen)} />

              {/* hamburger icon */}
              <svg
                className="swap-off"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.97656 5.97485H19.9766"
                  stroke="#1E3A59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.97656 11.9749H19.9766"
                  stroke="#1E3A59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.97656 17.9749H19.9766"
                  stroke="#1E3A59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* close icon */}
              <svg
                className="swap-on"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5229 22 22 17.5229 22 12C22 6.47715 17.5229 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5229 6.47715 22 12 22Z"
                  stroke="#1E3A59"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.8287 9.17163L9.17188 14.8285"
                  stroke="#1E3A59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.17188 9.17163L14.8287 14.8285"
                  stroke="#1E3A59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>
      <div
        className={`mobile-menu w-screen h-screen fixed top-0 pt-20 ${
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-200 lg:hidden`}
      >
        <ul className="mobile-main-nav">
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
        <div className="mobile-sub-nav">
          <div>{browserWidth && browserWidth < 1024 && <ConnectButton />}</div>
          <ul className="items-center flex gap-4 justify-center">
            <li>
              <Link href="https://x.com/insightsofweb3" target="_blank" className="">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.5 17.8811C3.46443 18.4143 10.4457 22.4386 15.41 19.337C20.3742 16.2353 20.1003 10.8916 20.1003 8.443C20.55 7.5009 21.5 7.02195 21.5 4.4719C20.5669 5.3339 19.6394 5.6272 18.7175 5.3518C17.8144 3.97478 16.5718 3.36573 14.9897 3.52467C12.6167 3.76307 11.7485 6.09125 12.004 9.10335C8.34495 10.9537 5.47575 7.762 3.99709 5.3518C3.50304 7.24995 3.02665 9.5288 3.99709 12.0497C4.64405 13.7303 6.19925 15.1512 8.6627 16.3123C6.16615 17.6654 4.11191 18.1883 2.5 17.8811Z"
                    stroke="#1E3A59"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="https://docs.web3insights.news" target="_blank" className="">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.5 18.5C3.5 14.6484 3.5 5.5 3.5 5.5C3.5 3.84315 4.84315 2.5 6.5 2.5H17.5V15.5C17.5 15.5 9.1163 15.5 6.5 15.5C4.85 15.5 3.5 16.8421 3.5 18.5Z"
                    stroke="#1E3A59"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 15.5C17.5 15.5 7.07685 15.5 6.5 15.5C4.84315 15.5 3.5 16.8432 3.5 18.5C3.5 20.1568 4.84315 21.5 6.5 21.5C7.60455 21.5 12.9379 21.5 20.5 21.5V3.5"
                    stroke="#1E3A59"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M7 18.5H17" stroke="#1E3A59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="mailto:sq30labs@gmail.com" target="_blank" className="">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 19.5H22V12V4.5H12H2V12V19.5Z" stroke="#1E3A59" strokeWidth="2" strokeLinejoin="round" />
                  <path
                    d="M2 4.5L12 12L22 4.5"
                    stroke="#1E3A59"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 4.5H2V12"
                    stroke="#1E3A59"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 12V4.5H12"
                    stroke="#1E3A59"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
            <li>
              <div className="justify-center py-2 flex">
                <LocaleSwitcher />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
