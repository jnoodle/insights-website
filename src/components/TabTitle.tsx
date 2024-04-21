import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export type TabTitlePropType = {
  active: "posts" | "predictions" | "news";
};
export function TabTitle(props: TabTitlePropType) {
  return (
    <div role="tablist" className="tabtitle tabs tabs-bordered fixed top-16 z-50 w-full max-w-5xl px-2 pt-2">
      <Link
        href={props.active === "posts" ? "" : "/"}
        role="tab"
        className={`tab ${props.active === "posts" ? "tab-active" : ""}`}
      >
        Posts
      </Link>
      <Link
        href={props.active === "predictions" ? "" : "/predictions"}
        role="tab"
        className={`tab ${props.active === "predictions" ? "tab-active" : ""}`}
      >
        Predictions
      </Link>
      <Link
        href={props.active === "news" ? "" : "/news"}
        role="tab"
        className={`tab ${props.active === "news" ? "tab-active" : ""}`}
      >
        News
      </Link>
    </div>
  );
}
