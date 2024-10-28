"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { filterString, formatPrice, dateFormat, toastConfig, ROI } from "@/app/utils";
import * as React from "react";
import parse from "html-react-parser";
import multiavatar from "@multiavatar/multiavatar/esm";
import { InsightsUser } from "@/components/Tweet";
import { Accuracy } from "@/components/Accuracy";
import numeral from "numeral";
import dayjs from "dayjs";
import { completePrediction, deleteItem } from "@/api/func";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { CompletePrediction as CompletePredictionBtn } from "@/components/CompletePrediction";
import { Avatar } from "@/components/Avatar";

export type CmcCoinInfo = {
  id?: number;
  last_updated?: string;
  name?: string;
  slug?: string;
  symbol?: string;
  quote?: any;
};

export type DexCoinInfo = {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  url: string; // dex url
  chainId: string;
  dexId: string; // dex id
  pairAddress: string;
  labels: string;
  dexscreenerPair?: any;
  priceChange?: any;
};

export type CoinInfo = {
  address: string;
  chainId: string;
  name: string;
  symbol: string;
  price: string;
  url: string;
};

export type PredictionPropType = {
  id: string;
  createTime?: string;
  userView?: InsightsUser;
  userId?: string;
  coinId?: string;
  resultAchievementTime?: string;
  actualCompletionTime?: string;
  resultPrice?: string;
  trend?: string;
  explanation?: string;
  tweetUrl?: string;
  price?: string;
  priceDayOne?: string;
  priceDayThree?: string;
  priceDayFive?: string;
  priceDaySeven?: string;
  success?: boolean;
  over?: boolean;
  coin: CoinInfo;
  roi: string;
};
export function Prediction(props: PredictionPropType) {
  const t = useTranslations("Prediction");
  const [btnCompleteLoading, setBtnCompleteLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(props.success);
  const [predictionResultPrice, setPredictionResultPrice] = useState(props.resultPrice || "");
  const [predictionResultTime, setPredictionResultTime] = useState(props.resultAchievementTime || "");
  const [predictionResultActualTime, setPredictionResultActualTime] = useState(props.actualCompletionTime || "");

  const [isDeleted, setIsDeleted] = useState(false);
  const [btnDeleteLoading, setBtnDeleteLoading] = useState(false);

  const resultIcon = () =>
    predictionResult === true ? (
      <div className="tooltip tooltip-left" data-tip={t("ROI")}>
        <span className="prediction-card-roi text-success">
          {/*{ROI(props.price, predictionResultPrice)}*/}
          {+props.roi > 10000 ? (
            <span>&gt; 100X</span>
          ) : (
            <>
              <span>{props.roi}</span>
              <span className="roi-percent">%</span>
            </>
          )}
        </span>
      </div>
    ) : predictionResult === false ? (
      <span className="prediction-card-roi text-error">
        {/*﹣{ROI(props.price, predictionResultPrice)}*/}
        {props.roi}
        <span className="roi-percent">%</span>
      </span>
    ) : (
      <Image src="/unknown.svg" width={48} height={48} priority alt={t("Unknown")} />
    );

  const getTextColor = (currentPrice: any) => {
    return currentPrice && props.price ? (currentPrice >= props.price ? "text-success" : "text-error") : "text-accent";
  };

  const currentUserAlias = localStorage.getItem("insights_user_alias");
  const currentUserIsOperator = sessionStorage.getItem("insights_user_r") === "op";

  const CompletePrediction = (id: string) => {
    if (window.confirm(t("ConfirmComplete"))) {
      setBtnCompleteLoading(true);
      completePrediction(id)
        .then((res: any) => {
          toast.success(t("CompleteSuccess"), toastConfig);
          if (res.data) {
            setPredictionResult(res.data.success);
            setPredictionResultPrice(res.data.resultPrice);
            setPredictionResultTime(res.data.resultAchievementTime);
            setPredictionResultActualTime(res.data.actualCompletionTime);
          }
        })
        .catch((e) => {
          toast.error(t("CompleteFailure"), toastConfig);
        })
        .finally(() => {
          setBtnCompleteLoading(false);
        });
    }
  };

  const handleDeletePrediction = (id: string) => {
    if (window.confirm(t("ConfirmDelete"))) {
      setBtnDeleteLoading(true);
      deleteItem(id, "prediction")
        .then(() => {
          toast.success(t("DeleteSuccess"), toastConfig);
          setIsDeleted(true);
        })
        .catch((e) => {
          toast.error(t("DeleteFailure"), toastConfig);
        })
        .finally(() => {
          setBtnDeleteLoading(false);
        });
    }
  };

  return (
    !isDeleted &&
    props.coin && (
      <div
        className="prediction-card flex flex-col w-full px-2 pt-3 pb-4 text-sm border-b border-b-secondary hover:bg-base-200"
        key={props.id}
      >
        <div className="author flex w-full justify-between items-center">
          <div className="flex items-center gap-2 lg:gap-4">
            <Avatar className=" " user={props.userView} />
            <div className="flex flex-col items-start justify-center">
              <div className="author-name">
                {/*TODO alias*/}
                <Link href={"/user/" + props.userView?.alias} className="link">
                  {props.userView && props.userView.name ? props.userView.name : t("Anonymous")}
                </Link>
              </div>
              <div className="author-roi">
                <Accuracy accuracy={props.userView?.accuracy} />
              </div>
            </div>
          </div>
        </div>
        <div className="prediction flex w-full flex-col justify-between items-center">
          <div className="token flex flex-row w-full justify-between items-center">
            <div className="trend flex items-center gap-x-1 lg:gap-x-2" title={props.explanation}>
              {props.trend === "rise" ? (
                <Image src="/rise.svg" width={64} height={64} priority alt={t("Rise")} />
              ) : (
                <Image src="/fall.svg" width={64} height={64} priority alt={t("Fall")} />
              )}
              <Link href={props.coin.url} target="_blank" className="link text-xl lg:text-2xl font-bold flex flex-col">
                <span>{props.coin.symbol}</span>
                <span className="text-neutral text-xs font-normal">{props.coin.name}</span>
              </Link>
            </div>
            <div className="flex items-center">{resultIcon()}</div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex flex-col items-start">
              <span className="content-label">{t("PriceAtCreate")}&nbsp;</span>
              <span className="content">
                <span>{formatPrice(props.price)}</span>
                <span className="date">({props.createTime && dateFormat(props.createTime)})</span>
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="content-label">{t("PriceAtFinish")}&nbsp;</span>
              <span className="content">
                <span className={`${getTextColor(predictionResultPrice)}`}>{formatPrice(predictionResultPrice)}</span>
                <span className="date">
                  (
                  {predictionResultActualTime
                    ? dateFormat(predictionResultActualTime)
                    : predictionResultTime
                      ? dateFormat(predictionResultTime)
                      : "-"}
                  )
                </span>
              </span>
            </div>
            <div className="flex flex-row w-full items-center justify-between">
              <div className="date">{props.createTime ? dateFormat(props.createTime) : "--"}</div>
              {(props.tweetUrl || props.explanation) && (
                <div className="flex items-center gap-x-1">
                  {props.explanation && (
                    <div className="tooltip" data-tip={props.explanation}>
                      <span className="btn btn-primary btn-sm rounded-full mr-2">{t("ViewExplanation")}</span>
                    </div>
                  )}
                  {props.tweetUrl && (
                    <a href={props.tweetUrl} target="_blank" className="btn btn-primary btn-sm rounded-full">
                      {t("OpenTweet")}
                    </a>
                  )}
                </div>
              )}
            </div>
            {predictionResult == null && props.userView && props.userView.alias === currentUserAlias && (
              <div className="flex flex-col lg:flex-row lg:items-center">
                <button
                  className="btn btn-primary btn-xs text-white font-normal"
                  onClick={() => CompletePrediction(props.id)}
                  disabled={btnCompleteLoading}
                >
                  {t("CompleteMyNow")}
                  {btnCompleteLoading && <span className="loading loading-spinner loading-xs"></span>}
                </button>
              </div>
            )}
            {currentUserIsOperator && (
              <>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  {predictionResult == null && (
                    <>
                      <button
                        className="btn btn-warning btn-xs font-normal"
                        onClick={() => CompletePrediction(props.id)}
                        disabled={btnCompleteLoading}
                      >
                        {t("CompleteNow")}
                        {btnCompleteLoading && <span className="loading loading-spinner loading-xs"></span>}
                      </button>
                      <CompletePredictionBtn id={props.id} createTime={props.createTime + ""} />
                    </>
                  )}
                  <button
                    className="btn btn-warning btn-xs font-normal"
                    disabled={btnDeleteLoading}
                    onClick={() => handleDeletePrediction(props.id)}
                  >
                    {t("Delete")}
                    {btnDeleteLoading && <span className="loading loading-spinner loading-xs"></span>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
