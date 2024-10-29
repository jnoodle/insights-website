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
import { Input } from "antd";
import type { GetProps } from "antd";
import { TopPredictions } from "@/components/TopPredictions";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

export default function Home() {
  const t = useTranslations("Pages");
  const [predictions, setPredictions]: [PredictionPropType[], any] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [fromIndex, setFromIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const effectRef = useRef(false);

  useEffect((): any => {
    // fix react 18 strict mode: https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
    if (!effectRef.current) {
      fetchMoreData();
      // setPredictions([{}, {}, {}, {}]);
    }
    return () => (effectRef.current = true);
  }, []);

  const fetchMoreData = (isReset = false, _keyword?: any) => {
    if (isLoading) return;

    setIsLoading(true);
    if (isReset) {
      setFromIndex(0);
      setPredictions([]);
    }
    axios
      .get(
        `/v0/public/predictions?from=${isReset ? 0 : fromIndex}&size=${pageSize}&keyword=${
          typeof _keyword !== "undefined" ? _keyword : keyword
        }`,
      )
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

  const onSearch: SearchProps["onSearch"] = (value: any) => {
    setKeyword(value + "");
    fetchMoreData(true, value + "");
  };

  const onClear = () => {
    setKeyword("");
    fetchMoreData(true, "");
  };

  return (
    <InfiniteScroll
      dataLength={predictions.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<Loading />}
      endMessage={<p className="end-message">{t("EndMessage")}</p>}
    >
      <div className="main-content flex flex-col items-center justify-between w-full mx-auto">
        <TabTitle active="predictions" />
        <TopPredictions />
        <div className="flex items-center justify-end w-full gap-x-2 py-6">
          <div className="text-right mt-2 w-full max-w-md">
            <Search
              placeholder={t("PredictionSearchPlaceholder")}
              allowClear={{ clearIcon: <span className="clear-btn btn btn-secondary btn-xs">{t("ResetSearch")}</span> }}
              onSearch={onSearch}
              /*
            // @ts-ignore */
              onClear={onClear}
              className="w-full search"
            />
          </div>
          <div className="text-right mt-2">
            <AddPrediction onSuccess={handerAddPredictionSuccess} />
          </div>
        </div>
        <div className="predictions-content flex flex-row flex-wrap">
          {predictions.map((t) => (
            <Prediction key={t.id} {...t} />
          ))}
        </div>
      </div>
    </InfiniteScroll>
  );
}
