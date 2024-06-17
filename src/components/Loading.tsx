import React from "react";
import { useTranslations } from "next-intl";

export const Loading = () => {
  const t = useTranslations("Loading");
  return (
    <div className="flex items-center justify-center w-full py-2">
      <span className="mr-1">{t("Loading")}</span>
      <span className="loading loading-dots loading-md"></span>
    </div>
  );
};
