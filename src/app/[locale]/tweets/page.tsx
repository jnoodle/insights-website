"use client";

import React, { useState, useEffect, useRef } from "react";
import { TabTitle } from "@/components/TabTitle";
import { Tweet, TweetPropType } from "@/components/Tweet";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Loading } from "@/components/Loading";
import { isLogin, pageSize } from "@/app/utils";
import { ArticlePropType } from "@/components/Article";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Pages");
  const [tweets, setTweets]: [TweetPropType[], any] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [fromIndex, setFromIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    // isLogin(); // TODO login everytime
    // fix react 18 strict mode: https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
    if (!effectRef.current) {
      fetchMoreData();
    }
    return () => (effectRef.current = true);
  }, []);

  const fetchMoreData = () => {
    if (isLoading) return;

    setIsLoading(true);
    axios
      .get(`/v0/public/tweets?from=${fromIndex}&size=${pageSize}`)
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setTweets((prevItems: ArticlePropType[]) => [...prevItems, ...res.data.data]);
          setFromIndex((prevIndex) => prevIndex + res.data.data.length);
          // TODO has more
          setHasMore(res.data.data.length >= pageSize);
        } else {
          setHasMore(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <InfiniteScroll
      dataLength={tweets.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<Loading />}
      endMessage={<p className="end-message">{t("EndMessage")}</p>}
    >
      <div className="main-content flex flex-col items-center justify-between w-full pt-8 mx-auto bg-white rounded-3xl px-8">
        <TabTitle active="tweets" />
        {tweets.map((t) => (
          <Tweet key={t.id} {...t} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
