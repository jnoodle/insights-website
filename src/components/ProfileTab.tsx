import * as React from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "@/components/Loading";
import { Tweet, TweetPropType } from "@/components/Tweet";
import axios from "axios";
import { pageSize } from "@/app/utils";
import { ArticlePropType } from "@/components/Article";
import { Prediction, PredictionPropType } from "@/components/Prediction";

export type ProfileTabPropType = {
  alias?: string;
};

export function ProfileTab(props: ProfileTabPropType) {
  const [activeTab, setActiveTab] = useState(0);
  const [tweets, setTweets]: [TweetPropType[], any] = useState([]);
  const [predictions, setPredictions]: [PredictionPropType[], any] = useState([]);
  const [tweetsHasMore, setTweetsHasMore] = useState(true);
  const [tweetsFromIndex, setTweetsFromIndex] = useState(0);
  const [tweetsIsLoading, setTweetsIsLoading] = useState(false);
  const [predictionsHasMore, setPredictionsHasMore] = useState(true);
  const [predictionsFromIndex, setPredictionsFromIndex] = useState(0);
  const [predictionsIsLoading, setPredictionsIsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    // fix react 18 strict mode: https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
    if (!effectRef.current) {
      fetchMoreTweetsData();
      fetchMorePredictionsData();
    }
    return () => (effectRef.current = true);
  }, []);

  const handleTabClick = (tabIndex: number) => {
    if (tabIndex !== activeTab) {
      setActiveTab(tabIndex);
    }
  };

  const fetchMoreTweetsData = () => {
    if (tweetsIsLoading) return;

    setTweetsIsLoading(true);
    axios
      .get(`/v0/public/tweets?from=${tweetsFromIndex}&size=${pageSize}&alias=${props.alias}`)
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setTweets((prevItems: ArticlePropType[]) => [...prevItems, ...res.data.data]);
          setTweetsFromIndex((prevIndex) => prevIndex + res.data.data.length);
          // TODO has more
          setTweetsHasMore(res.data.data.length >= pageSize);
        } else {
          setTweetsHasMore(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setTweetsIsLoading(false);
      });
  };

  const fetchMorePredictionsData = () => {
    if (predictionsIsLoading) return;

    setPredictionsIsLoading(true);
    axios
      .get(`/v0/public/predictions?from=${predictionsFromIndex}&size=${pageSize}&alias=${props.alias}`)
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setPredictions((prevItems: ArticlePropType[]) => [...prevItems, ...res.data.data]);
          setPredictionsFromIndex((prevIndex) => prevIndex + res.data.data.length);
          // TODO has more
          setPredictionsHasMore(res.data.data.length >= pageSize);
        } else {
          setPredictionsHasMore(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setPredictionsIsLoading(false);
      });
  };

  return (
    <div className="flex w-full flex-col">
      <div role="tablist" className="tabtitle tabs tabs-bordered w-full max-w-5xl px-2 pt-2">
        <div role="tab" className={`tab ${activeTab === 0 ? "tab-active" : ""}`} onClick={() => handleTabClick(0)}>
          Posts
        </div>
        <div role="tab" className={`tab ${activeTab === 1 ? "tab-active" : ""}`} onClick={() => handleTabClick(1)}>
          Predictions
        </div>
      </div>
      <div className="w-full">
        {activeTab === 0 ? (
          <InfiniteScroll
            dataLength={tweets.length}
            next={fetchMoreTweetsData}
            hasMore={tweetsHasMore}
            loader={<Loading />}
            endMessage={<p className="text-center py-2">Yay! You have seen it all</p>}
          >
            <div className="flex flex-col items-center justify-between w-full pt-2">
              {tweets.map((t) => (
                <Tweet {...t} />
              ))}
            </div>
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            dataLength={predictions.length}
            next={fetchMorePredictionsData}
            hasMore={predictionsHasMore}
            loader={<Loading />}
            endMessage={<p className="text-center py-2">Yay! You have seen it all</p>}
          >
            <div className="flex flex-col items-center justify-between w-full pt-2">
              {predictions.map((t) => (
                <Prediction {...t} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}