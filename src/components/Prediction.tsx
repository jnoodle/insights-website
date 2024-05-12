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
};
export function Prediction(props: PredictionPropType) {
  const [viewDetails, setViewDetails] = useState(false);
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
        <div className="flex items-center md:hidden">
          {props.success ? (
            <Image src="/success.svg" width={42} height={42} priority alt="success" />
          ) : (
            <Image src="/failure.svg" width={42} height={42} priority alt="failure" />
          )}
        </div>
      </div>
      <div className="prediction flex w-full flex-col md:flex-row justify-between items-start md:items-center md:pl-5">
        <div className="flex items-center gap-2">
          {props.trend === "rise" ? (
            <Image src="/rise.svg" width={64} height={64} priority alt="rise" />
          ) : (
            <Image src="/fall.svg" width={64} height={64} priority alt="fall" />
          )}
          <Link
            href={`https://coinmarketcap.com/currencies/${props.coinId}/`}
            target="_blank"
            className="link text-primary text-base font-bold"
          >
            {props.coinId}
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col md:flex-row">
            <span>
              Price during prediction: <span className="font-bold text-accent">{formatPrice(props.price)}</span>
            </span>
            <span className="ml-1 text-xs md:text-sm">(Mar 29, 2024 at 4:51 p.m.)</span>
          </div>
          <div className="flex flex-col md:flex-row">
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
        <div className="flex items-center hidden md:block">
          {props.success ? (
            <Image src="/success.svg" width={42} height={42} priority alt="success" />
          ) : (
            <Image src="/failure.svg" width={42} height={42} priority alt="failure" />
          )}
        </div>
      </div>
    </div>
  );
}
