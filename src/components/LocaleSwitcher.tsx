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
    <div className="dropdown dropdown-end">
      <div tabIndex={0} className="btn btn-sm btn-ghost font-normal m-1 gap-0">
        <span>{t("localeShort", { locale: locale.replaceAll("-", "_") })}</span>
        <img src="/downArrowBlack.svg" alt="" className="inline w-5" />
      </div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 z-100">
        {locales
          // .filter((l) => l !== locale)
          .map((cur) => (
            <li key={cur}>
              <a onClick={() => onLangClick(cur)}>{t("locale", { locale: cur.replaceAll("-", "_") })}</a>
            </li>
          ))}
      </ul>
    </div>
  );
}
