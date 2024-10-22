import React from "react";
import numeral from "numeral";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/app/utils";

export const Accuracy = ({ accuracy }: any) => {
  const t = useTranslations("Prediction");
  return (
    <span className="flex flex-col lg:flex-row lg:gap-2">
      {accuracy && typeof accuracy.roi !== "undefined" && (
        <span>
          {t("Roi")}
          {accuracy.roi == null ? (
            "--"
          ) : (
            <span className={`font-bold ${+accuracy.roi >= 0 ? "text-success" : "text-error"}`}>
              {accuracy.roi > 10000 ? ">100X" : accuracy.roi + "%"}
            </span>
          )}
        </span>
      )}
      <span>
        {t("Accuracy")}
        {accuracy && (accuracy.success || accuracy.failure) ? (
          <>
            <span className="font-bold">
              {numeral(accuracy.success / ((accuracy.success || 0) + (accuracy.failure || 0))).format("0.0%")}
            </span>{" "}
            ({accuracy.success || 0}/{(accuracy.success || 0) + (accuracy.failure || 0)})
          </>
        ) : (
          "--"
        )}
      </span>
    </span>
  );
};
