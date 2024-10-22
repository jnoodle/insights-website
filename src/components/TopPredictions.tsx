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
  return (
    <div className="flex flex-col items-center justify-center w-full my-2 py-4 px-4 border rounded-lg border-secondary">
      <h1 className="text-accent font-bold text-lg border-b  border-secondary w-full text-center pb-2">{t("Title")}</h1>
      {isTopPredictionsLoading && <span className="loading loading-dots loading-sm mt-2"></span>}
      <ol className="text-left w-full list-decimal pl-0 text-neutral text-sm mt-2">
        {predictions.map((p, i) => (
          <li key={i} className="p-2 hover:bg-base-200 list-none flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 text-right">{i + 1}.</div>
              <Avatar className="w-6 rounded-full" user={p} />
              <Link href={"/user/" + p?.alias} className="link font-bold text-base">
                {p.name ? p.name : t("Anonymous")}
              </Link>
              {/*<div>*/}
              {/*  <span>*/}
              {/*    {t2("Accuracy")}*/}
              {/*    {p && (p.success || p.failure) ? (*/}
              {/*      <>*/}
              {/*        <span className="font-bold">*/}
              {/*          {numeral(p.success / ((p.success || 0) + (p.failure || 0))).format("0.0%")}*/}
              {/*        </span>{" "}*/}
              {/*        ({p.success || 0}/{(p.success || 0) + (p.failure || 0)})*/}
              {/*      </>*/}
              {/*    ) : (*/}
              {/*      "--"*/}
              {/*    )}*/}
              {/*  </span>*/}
              {/*</div>*/}
            </div>
            {p.roiAverage && (
              <div className={`text-base font-bold ${+p.roiAverage >= 0 ? "text-success" : "text-error"}`}>
                {p.roiAverage > 10000 ? (
                  <span className="flex items-center">
                    <span>&gt; 100X</span>
                    <img src="/star.svg" alt="Star" className="w-6 h-6" />
                  </span>
                ) : (
                  p.roiAverage + "%"
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
