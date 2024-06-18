"use client";

import React, { useEffect, useRef, useState } from "react";
import { ellipseAddress, filterString } from "@/app/utils";
import Link from "next/link";
import ProfileTab from "@/components/ProfileTab";
import multiavatar from "@multiavatar/multiavatar/esm";
import parse from "html-react-parser";
import { getUserProfile } from "@/api/user";
import { InsightsUser } from "@/components/Tweet";
import { Accuracy } from "@/components/Accuracy";
import { useTranslations } from "next-intl";

export default function Home({ params }: { params: { alias: string } }) {
  const t = useTranslations("Pages");
  const [userInfo, setUserInfo]: [InsightsUser, any] = useState({});
  const effectRef = useRef(false);

  useEffect((): any => {
    if (!effectRef.current) {
      (async () => {
        setUserInfo(await getUserProfile(params.alias));
      })();
    }
    return () => (effectRef.current = true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between w-full pt-4 md:pt-8">
      <div className="flex items-center gap-2 md:gap-4 w-full md:flex-row flex-col">
        <div className="avatar md:mt-0 mt-4">
          <div className="w-20 md:w-32 rounded-full">
            {userInfo &&
              userInfo.alias &&
              (userInfo.avatarUrl ? (
                <img src={userInfo.avatarUrl} alt={userInfo && userInfo.name ? userInfo.name : "Anonymous"} />
              ) : (
                parse(multiavatar(params.alias || t("Anonymous")))
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 md:w-auto w-11/12">
          <div className="text-xl font-bold text-accent">{userInfo.name}</div>
          <div className="">@{params.alias}</div>
          <div className="">
            <Accuracy accuracy={userInfo.accuracy} />
          </div>
          <div className="">
            Twitter:{" "}
            {userInfo.tweet && userInfo.tweet.name ? (
              <span>
                <Link href={"https://twitter.com/" + userInfo.tweet!.screenName} target="_blank">
                  {userInfo.tweet && userInfo.tweet.name ? userInfo.tweet.name : t("Anonymous")} @
                  {userInfo.tweet && userInfo.tweet.screenName ? userInfo.tweet.screenName : "anonymous"}
                </Link>
              </span>
            ) : (
              "/"
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center w-full mt-6">
        <ProfileTab alias={params.alias} />
      </div>
    </div>
  );
}
