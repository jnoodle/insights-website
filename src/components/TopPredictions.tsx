import React, { useEffect, useRef, useState } from "react";
import { getTopPredictions } from "@/api/public";
import { useTranslations } from "next-intl";
import Link from "next/link";
import parse from "html-react-parser";
import multiavatar from "@multiavatar/multiavatar/esm";
import { filterString, formatPrice } from "@/app/utils";
import { Accuracy } from "@/components/Accuracy";
import numeral from "numeral";
import { Avatar } from "@/components/Avatar";

export type TopPredictionsType = {
  id: string;
  userId?: string;
  alias: string;
  avatarUrl?: string;
  name?: string;
  failure?: number;
  success?: number;
  roiTotal?: number;
  roiAverage?: number;
};

export const TopPredictions = () => {
  const t = useTranslations("TopPrediction");
  const t2 = useTranslations("Prediction");
  const [predictions, setPredictions] = useState<TopPredictionsType[]>([]);
  const [isTopPredictionsLoading, setIsTopPredictionsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    if (!effectRef.current) {
      getPredictions();
    }
    return () => (effectRef.current = true);
  }, []);
  const getPredictions = () => {
    if (isTopPredictionsLoading) return;
    setIsTopPredictionsLoading(true);
    getTopPredictions()
      .then((res) => {
        if (res && res.length > 0) {
          setPredictions(res);
        }
      })
      .finally(() => {
        setIsTopPredictionsLoading(false);
      });
  };

  const renderROI = (p: TopPredictionsType) =>
    p.roiAverage && (
      <div className={`roi-text font-bold ${+p.roiAverage >= 0 ? "text-success" : "text-error"}`}>
        {p.roiAverage > 10000 ? (
          <span className="roi-text-content star">&gt; 100X</span>
        ) : (
          <span className="roi-text-content">{p.roiAverage + "%"}</span>
        )}
      </div>
    );

  return (
    <div className="ranking-roi ranking flex flex-col items-center justify-center w-full">
      <h1 className="text-accent w-full pb-2">
        <i></i>
        {t("Title")}
        <i></i>
      </h1>
      {isTopPredictionsLoading ? (
        <span className="loading loading-dots loading-sm mt-4"></span>
      ) : (
        predictions &&
        predictions.length > 4 && (
          <>
            <div className="ranking-top flex flex-row">
              <div className="ranking-top-card winner-2">
                <Avatar className=" " user={predictions[1]} />
                <Link href={"/user/" + predictions[1].alias} className="link">
                  {predictions[1].name ? predictions[1].name : t("Anonymous")}
                </Link>
                {renderROI(predictions[1])}
              </div>
              <div className="ranking-top-card winner-1">
                <Avatar className=" " user={predictions[0]} />
                <Link href={"/user/" + predictions[0].alias} className="link">
                  {predictions[0].name ? predictions[0].name : t("Anonymous")}
                </Link>
                {renderROI(predictions[0])}
              </div>
              <div className="ranking-top-card winner-3">
                <Avatar className=" " user={predictions[2]} />
                <Link href={"/user/" + predictions[2].alias} className="link">
                  {predictions[2].name ? predictions[2].name : t("Anonymous")}
                </Link>
                {renderROI(predictions[2])}
              </div>
            </div>
            <ol className="rank-list text-left w-full list-decimal pl-0 text-neutral text-sm mt-2 hidden lg:block">
              {predictions.slice(3).map((p, i) => (
                <li key={i} className="list-none flex justify-between">
                  <div className="flex items-center">
                    <div className="rank-no">No. {i + 4}</div>
                    <Avatar className=" " user={p} />
                    <Link href={"/user/" + predictions[0].alias} className="link">
                      {p.name ? p.name : t("Anonymous")}
                    </Link>
                  </div>
                  {renderROI(p)}
                </li>
              ))}
            </ol>
          </>
        )
      )}
    </div>
  );
};
