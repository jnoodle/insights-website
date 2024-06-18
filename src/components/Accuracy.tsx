import React from "react";
import numeral from "numeral";
import { useTranslations } from "next-intl";

export const Accuracy = ({ accuracy }: any) => {
  const t = useTranslations("Accuracy");
  return (
    <span className="">
      {t("Accuracy")}{" "}
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
  );
};
