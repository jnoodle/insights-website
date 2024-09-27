import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AdBanner } from "@/components/AdBanner";

export type TabTitlePropType = {
  active: "posts" | "predictions" | "news";
  isFixed?: boolean;
};
export function TabTitle({ isFixed = true, ...props }: TabTitlePropType) {
  const t = useTranslations("Nav");
  return (
    <>
      <AdBanner />
      <div
        role="tablist"
        className={`tabtitle tabs tabs-bordered ${!isFixed ? "" : "fixed top-16 z-40"} w-full max-w-5xl px-2 pt-2`}
      >
        <Link
          href={props.active === "posts" ? "" : "/"}
          role="tab"
          className={`tab ${props.active === "posts" ? "tab-active" : ""}`}
        >
          {t("Posts")}
        </Link>
        <Link
          href={props.active === "predictions" ? "" : "/predictions"}
          role="tab"
          className={`tab ${props.active === "predictions" ? "tab-active" : ""}`}
        >
          {t("Predictions")}
        </Link>
        <Link
          href={props.active === "news" ? "" : "/news"}
          role="tab"
          className={`tab ${props.active === "news" ? "tab-active" : ""}`}
        >
          {t("News")}
        </Link>
      </div>
    </>
  );
}
