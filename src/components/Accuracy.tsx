import React from "react";
import numeral from "numeral";

export const Accuracy = ({ accuracy }: any) => (
  <span className="">
    Accuracy:{" "}
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
