import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AdBanner } from "@/components/AdBanner";

export type TabTitlePropType = {
  active: "tweets" | "predictions" | "news";
  isFixed?: boolean;
};
export function TabTitle({ isFixed = true, ...props }: TabTitlePropType) {
  const t = useTranslations("Nav");
  return (
    <>
      {/*<AdBanner />*/}
      {/*<div*/}
      {/*  role="tablist"*/}
      {/*  className={`tabtitle tabs tabs-bordered ${!isFixed ? "" : "fixed top-16 z-40"} w-full max-w-7xl px-2 pt-2`}*/}
      {/*>*/}
      {/*  <Link*/}
      {/*    href={props.active === "predictions" ? "" : "/"}*/}
      {/*    role="tab"*/}
      {/*    className={`tab ${props.active === "predictions" ? "tab-active" : ""}`}*/}
      {/*  >*/}
      {/*    {t("Predictions")}*/}
      {/*  </Link>*/}
      {/*  <Link*/}
      {/*    href={props.active === "tweets" ? "" : "/tweets"}*/}
      {/*    role="tab"*/}
      {/*    className={`tab ${props.active === "tweets" ? "tab-active" : ""}`}*/}
      {/*  >*/}
      {/*    {t("Tweets")}*/}
      {/*  </Link>*/}
      {/*  <Link*/}
      {/*    href={props.active === "news" ? "" : "/news"}*/}
      {/*    role="tab"*/}
      {/*    className={`tab ${props.active === "news" ? "tab-active" : ""}`}*/}
      {/*  >*/}
      {/*    {t("News")}*/}
      {/*  </Link>*/}
      {/*</div>*/}
    </>
  );
}
