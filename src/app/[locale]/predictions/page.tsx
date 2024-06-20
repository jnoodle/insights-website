"use client";

import React, { useState, useEffect, useRef } from "react";
import { TabTitle } from "@/components/TabTitle";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { Loading } from "@/components/Loading";
import { pageSize } from "@/app/utils";
import { Prediction, PredictionPropType } from "@/components/Prediction";
import { AddPrediction } from "@/components/AddPrediction";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Pages");
  const [predictions, setPredictions]: [PredictionPropType[], any] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [fromIndex, setFromIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    // fix react 18 strict mode: https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
    if (!effectRef.current) {
      fetchMoreData();
      // setPredictions([{}, {}, {}, {}]);
    }
    return () => (effectRef.current = true);
  }, []);

  const fetchMoreData = (isReset = false) => {
    if (isLoading) return;

    setIsLoading(true);
    if (isReset) {
      setFromIndex(0);
      setPredictions([]);
    }
    axios
      .get(`/v0/public/predictions?from=${isReset ? 0 : fromIndex}&size=${pageSize}`)
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setPredictions((prevItems: PredictionPropType[]) =>
            isReset ? res.data.data : [...prevItems, ...res.data.data],
          );
          setFromIndex((prevIndex) => (isReset ? 0 : prevIndex + res.data.data.length));
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

  const handerAddPredictionSuccess = () => {
    fetchMoreData(true);
  };

  return (
    <InfiniteScroll
      dataLength={predictions.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<Loading />}
      endMessage={<p className="text-center py-2">{t("EndMessage")}</p>}
    >
      <div className="flex flex-col items-center justify-between w-full pt-14">
        <TabTitle active="predictions" />
        <div className="w-full text-right mt-2">
          <AddPrediction onSuccess={handerAddPredictionSuccess} />
        </div>
        {predictions.map((t) => (
          <Prediction key={t.id} {...t} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
