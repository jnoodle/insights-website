"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { utcLocal } from "@/app/utils";
import * as React from "react";

export type PredicionPropType = {
  id?: string;
  createTime?: string;
  user?: any;
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
export function Predicion(props: PredicionPropType) {
  const [viewDetails, setViewDetails] = useState(false);
  return (
    <div className="flex flex-col w-full px-2 pt-3 pb-4 text-sm border-b border-b-secondary" key={props.id}>
      <div className="author flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={props.user && props.user.profileImageUrl ? props.user.profileImageUrl : "/X_black.svg"}
                alt={props.user && props.user.name ? props.user.name : "Anonymous"}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
            <div className="text-base font-bold">
              <Link href={"#"} className="link">
                {props.user && props.user.name ? props.user.name : "Anonymous"}
              </Link>
            </div>
            {/*<div>@{props.user && props.user.screenName ? props.user.screenName : "anonymous"}</div>*/}
            <div>Accuracy: 60% (6/10)</div>
          </div>
        </div>
        <div className="date hidden md:block">
          {props.createTime ? utcLocal(props.createTime) : new Date().toLocaleString()}
        </div>
        <div className="flex items-center md:hidden">
          <Image src="/success.svg" width={42} height={42} priority alt="success" />
        </div>
      </div>
      <div className="prediction flex w-full flex-col md:flex-row justify-between items-start md:items-center md:pl-5">
        <div className="flex items-center gap-2">
          <Image src="/rise.svg" width={64} height={64} priority alt="rise" />
          <Link href={"#"} target="_blank" className="link text-primary text-base font-bold">
            ETH
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col md:flex-row">
            <span>
              Price during prediction: <span className="font-bold text-accent">$3,358.89</span>
            </span>
            <span className="ml-1 text-xs md:text-sm">(Mar 29, 2024 at 4:51 p.m.)</span>
          </div>
          <div className="flex flex-col md:flex-row">
            <span>
              Price (1d): <span className="font-bold text-accent">$3,458.89</span>
            </span>
            <span className="md:ml-2">
              Price (3d): <span className="font-bold text-accent">$3,258.89</span>
            </span>
            <span className="md:ml-2">
              Price (7d): <span className="font-bold text-accent">$3,658.89</span>
            </span>
          </div>
        </div>
        <div className="flex items-center hidden md:block">
          <Image src="/success.svg" width={42} height={42} priority alt="success" />
        </div>
      </div>
    </div>
  );
}
