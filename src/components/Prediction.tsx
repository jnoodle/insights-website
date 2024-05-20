"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { filterString, formatPrice, utcLocal } from "@/app/utils";
import * as React from "react";
import parse from "html-react-parser";
import multiavatar from "@multiavatar/multiavatar/esm";
import { InsightsUser } from "@/components/Tweet";
import { Accuracy } from "@/components/Accuracy";
import numeral from "numeral";
import dayjs from "dayjs";

export type CoinInfo = {
  id?: number;
  last_updated?: string;
  name?: string;
  slug?: string;
  symbol?: string;
  quote?: any;
};
export type PredictionPropType = {
  id?: string;
  createTime?: string;
  userView?: InsightsUser;
  userId?: string;
  coinId?: string;
  resultAchievementTime?: string;
  trend?: string;
  explanation?: string;
  price?: string;
  priceDayOne?: string;
  priceDayThree?: string;
  priceDayFive?: string;
  priceDaySeven?: string;
  success?: boolean;
  over?: boolean;
  coin: CoinInfo;
};
export function Prediction(props: PredictionPropType) {
  const [viewDetails, setViewDetails] = useState(false);

  const resultIcon = () =>
    props.success === true ? (
      <Image src="/success.svg" width={42} height={42} priority alt="success" />
    ) : props.success === false ? (
      <Image src="/failure.svg" width={42} height={42} priority alt="failure" />
    ) : (
      <Image src="/failure.svg" width={42} height={42} priority alt="failure" className="invisible" />
    );

  return (
    <div className="flex flex-col w-full px-2 pt-3 pb-4 text-sm border-b border-b-secondary" key={props.id}>
      <div className="author flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full">
              {props.userView && props.userView.avatarUrl ? (
                <img
                  src={props.userView.avatarUrl}
                  alt={props.userView && props.userView.name ? props.userView.name : "Anonymous"}
                />
              ) : (
                parse(
                  multiavatar(props.userView && props.userView.name ? filterString(props.userView.name) : "Anonymous"),
                )
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
            <div className="text-base font-bold">
              {/*TODO alias*/}
              <Link href={"/user/" + props.userView?.alias} className="link">
                {props.userView && props.userView.name ? props.userView.name : "Anonymous"}
              </Link>
            </div>
            {/*<div>@{props.userView && props.userView.screenName ? props.userView.screenName : "anonymous"}</div>*/}
            <div>
              <Accuracy accuracy={props.userView?.accuracy} />
            </div>
          </div>
        </div>
        <div className="date hidden md:block">
          {props.createTime ? utcLocal(props.createTime) : new Date().toLocaleString()}
        </div>
        <div className="flex items-center md:hidden">{resultIcon()}</div>
      </div>
      <div className="prediction flex w-full flex-col md:flex-row justify-between items-start md:items-center md:pl-5">
        <div className="flex items-center gap-2 min-w-60" title={props.explanation}>
          {props.trend === "rise" ? (
            <Image src="/rise.svg" width={64} height={64} priority alt="rise" />
          ) : (
            <Image src="/fall.svg" width={64} height={64} priority alt="fall" />
          )}
          <Link
            href={`https://coinmarketcap.com/currencies/${props.coin.slug}/`}
            target="_blank"
            className="link text-primary text-base font-bold flex flex-col"
          >
            <span>{props.coin.symbol}</span>
            <span className="text-xs font-normal">({props.coin.name})</span>
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2 grow">
          <div className="flex flex-col md:flex-row items-center">
            <span>
              Price at prediction creation: <span className="font-bold text-accent">{formatPrice(props.price)}</span>
            </span>
            <span className="ml-1 text-xs md:text-sm">({props.createTime && utcLocal(props.createTime)})</span>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <span>
              Price at prediction fulfillment: <span className="font-bold text-accent">{formatPrice(null)}</span>
            </span>
            <span className="ml-1 text-xs md:text-sm">
              ({props.resultAchievementTime && utcLocal(props.resultAchievementTime)})
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <span>
              Price (1d): <span className="font-bold text-accent">{formatPrice(props.priceDayOne)}</span>
            </span>
            <span className="md:ml-2">
              Price (3d): <span className="font-bold text-accent">{formatPrice(props.priceDayThree)}</span>
            </span>
            <span className="md:ml-2">
              Price (7d): <span className="font-bold text-accent">{formatPrice(props.priceDaySeven)}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center hidden md:block">{resultIcon()}</div>
      </div>
    </div>
  );
}
