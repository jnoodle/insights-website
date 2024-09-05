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
        <span className="text-lg text-success font-bold md:text-2xl">
          {/*{ROI(props.price, predictionResultPrice)}*/}
          {+props.roi > 10000 ? (
            <span>&gt; 100X</span>
          ) : (
            <>
              <span>{props.roi}</span>
              <span className="text-base">%</span>
            </>
          )}
        </span>
      </div>
    ) : predictionResult === false ? (
      <div className="tooltip tooltip-left" data-tip={t("ROI")}>
        <span className="text-lg text-error font-bold md:text-2xl">
          {/*﹣{ROI(props.price, predictionResultPrice)}*/}
          {props.roi}
          <span className="text-base">%</span>
        </span>
      </div>
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
        className="flex flex-col w-full px-2 pt-3 pb-4 text-sm border-b border-b-secondary hover:bg-base-200"
        key={props.id}
      >
        <div className="author flex w-full justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-12 rounded-full">
                {props.userView && props.userView.avatarUrl ? (
                  <img
                    src={props.userView.avatarUrl}
                    alt={props.userView && props.userView.name ? props.userView.name : t("Anonymous")}
                  />
                ) : (
                  parse(
                    multiavatar(
                      props.userView && props.userView.name ? filterString(props.userView.name) : t("Anonymous"),
                    ),
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
              <div className="text-base font-bold">
                {/*TODO alias*/}
                <Link href={"/user/" + props.userView?.alias} className="link">
                  {props.userView && props.userView.name ? props.userView.name : t("Anonymous")}
                </Link>
              </div>
              {/*<div>@{props.userView && props.userView.screenName ? props.userView.screenName : "anonymous"}</div>*/}
              <div>
                <Accuracy accuracy={props.userView?.accuracy} />
              </div>
            </div>
          </div>
          <div className="date hidden md:block">
            {props.createTime ? dateFormat(props.createTime) : new Date().toLocaleString()}
          </div>
          <div className="flex items-center md:hidden">{resultIcon()}</div>
        </div>
        <div className="prediction flex w-full flex-col md:flex-row justify-between items-start md:items-center md:pl-5">
          <div className="flex items-center gap-2 min-w-60" title={props.explanation}>
            {props.trend === "rise" ? (
              <Image src="/rise.svg" width={64} height={64} priority alt={t("Rise")} />
            ) : (
              <Image src="/fall.svg" width={64} height={64} priority alt={t("Fall")} />
            )}
            <Link href={props.coin.url} target="_blank" className="link text-primary text-2xl font-bold flex flex-col">
              <span>{props.coin.symbol}</span>
              <span className="text-xs font-normal">{props.coin.name}</span>
            </Link>
          </div>
          <div className="flex flex-col items-start gap-2 grow">
            <div className="flex flex-col md:flex-row md:items-center">
              <span>{t("PriceAtCreate")}&nbsp;</span>
              <span className="text-xs md:text-sm">
                <span className="font-bold text-accent text-sm">{formatPrice(props.price)}</span> (
                {props.createTime && dateFormat(props.createTime)})
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <span>{t("PriceAtFinish")}&nbsp;</span>
              <span className="text-xs md:text-sm">
                <span className={`font-bold text-sm ${getTextColor(predictionResultPrice)}`}>
                  {formatPrice(predictionResultPrice)}
                  {/*{predictionResult != null &&*/}
                  {/*  predictionResultPrice &&*/}
                  {/*  " (ROI:" + ROI(props.price, predictionResultPrice) + "%)"}*/}
                </span>
                &nbsp;(
                {predictionResultActualTime
                  ? dateFormat(predictionResultActualTime)
                  : predictionResultTime
                    ? dateFormat(predictionResultTime)
                    : "-"}
                )
              </span>
            </div>
            {/*<div className="flex flex-col md:flex-row md:items-center">*/}
            {/*  <span>*/}
            {/*    Price (1d):{" "}*/}
            {/*    <span className={`font-bold ${getTextColor(props.priceDayOne)}`}>{formatPrice(props.priceDayOne)}</span>*/}
            {/*  </span>*/}
            {/*  <span className="md:ml-2">*/}
            {/*    Price (3d):{" "}*/}
            {/*    <span className={`font-bold ${getTextColor(props.priceDayThree)}`}>*/}
            {/*      {formatPrice(props.priceDayThree)}*/}
            {/*    </span>*/}
            {/*  </span>*/}
            {/*  <span className="md:ml-2">*/}
            {/*    Price (5d):{" "}*/}
            {/*    <span className={`font-bold ${getTextColor(props.priceDayFive)}`}>{formatPrice(props.priceDayFive)}</span>*/}
            {/*  </span>*/}
            {/*  <span className="md:ml-2">*/}
            {/*    Price (7d):{" "}*/}
            {/*    <span className={`font-bold ${getTextColor(props.priceDaySeven)}`}>*/}
            {/*      {formatPrice(props.priceDaySeven)}*/}
            {/*    </span>*/}
            {/*  </span>*/}
            {/*</div>*/}
            {(props.tweetUrl || props.explanation) && (
              <div className="flex md:items-center gap-2">
                {props.explanation && (
                  <div className="tooltip" data-tip={props.explanation}>
                    <span className="link text-primary mr-2">{t("ViewExplanation")}</span>
                  </div>
                )}
                {props.tweetUrl && (
                  <a href={props.tweetUrl} target="_blank">
                    {t("OpenTweet")}
                  </a>
                )}
              </div>
            )}
            {predictionResult == null && props.userView && props.userView.alias === currentUserAlias && (
              <div className="flex flex-col md:flex-row md:items-center">
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
                <div className="flex flex-col md:flex-row md:items-center gap-2">
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
          <div className="flex items-center hidden md:block">{resultIcon()}</div>
        </div>
      </div>
    )
  );
}
