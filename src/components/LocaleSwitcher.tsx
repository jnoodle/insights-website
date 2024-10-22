"use client";

import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/config";
import * as React from "react";
import { useRouter, usePathname } from "@/navigation";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const onLangClick = (nextLocale: string) => {
    if (nextLocale !== locale)
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
  };

  return (
    <div className="dropdown dropdown-top lg:dropdown-bottom dropdown-end">
      <div tabIndex={0} className="link">
        {/*<span>{t("localeShort", { locale: locale.replaceAll("-", "_") })}</span>*/}
        {/*<img src="/downArrowBlack.svg" alt="" className="inline w-5" />*/}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 22C17.5229 22 22 17.5229 22 12C22 6.47715 17.5229 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5229 6.47715 22 12 22Z"
            stroke="#1E3A59"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 12H22" stroke="#1E3A59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 22C14.2092 22 16 17.5229 16 12C16 6.47715 14.2092 2 12 2C9.79085 2 8 6.47715 8 12C8 17.5229 9.79085 22 12 22Z"
            stroke="#1E3A59"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.92969 5.07104C6.73933 6.88069 9.23933 7.99999 12.0007 7.99999C14.7622 7.99999 17.2622 6.88069 19.0718 5.07104"
            stroke="#1E3A59"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.0718 18.9289C17.2622 17.1193 14.7622 16 12.0007 16C9.23933 16 6.73933 17.1193 4.92969 18.9289"
            stroke="#1E3A59"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 z-100">
        {locales
          // .filter((l) => l !== locale)
          .map((cur) => (
            <li key={cur}>
              <a className={cur === locale ? "active-link" : ""} onClick={() => onLangClick(cur)}>
                {t("locale", { locale: cur.replaceAll("-", "_") })}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
