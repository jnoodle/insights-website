"use client";

import * as React from "react";
import Link from "next/link";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading } from "@/components/Loading";
import { Tweet, TweetPropType } from "@/components/Tweet";
import axios from "axios";
import { dateFormat, filterString, pageSize, toastConfig } from "@/app/utils";
import { ArticlePropType } from "@/components/Article";
import { Prediction, PredictionPropType } from "@/components/Prediction";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import multiavatar from "@multiavatar/multiavatar/esm";

export type ProfileTabPropType = {
  alias?: string;
  invitationCode?: string;
  activeTabName?: string;
  isPublic: boolean;
};

const ProfileTab = forwardRef((props: ProfileTabPropType, ref) => {
  const t = useTranslations("ProfileTab");
  const [activeTab, setActiveTab] = useState(1); // default tab predictions
  const [tweets, setTweets]: [TweetPropType[], any] = useState([]);
  const [predictions, setPredictions]: [PredictionPropType[], any] = useState([]);
  const [invitations, setInvitations]: [any[], any] = useState([]);
  const [points, setPoints]: [any[], any] = useState([]);
  const [tweetsHasMore, setTweetsHasMore] = useState(true);
  const [tweetsFromIndex, setTweetsFromIndex] = useState(0);
  const [tweetsIsLoading, setTweetsIsLoading] = useState(false);
  const [predictionsHasMore, setPredictionsHasMore] = useState(true);
  const [predictionsFromIndex, setPredictionsFromIndex] = useState(0);
  const [predictionsIsLoading, setPredictionsIsLoading] = useState(false);
  const [invitationsHasMore, setInvitationsHasMore] = useState(true);
  const [invitationsFromIndex, setInvitationsFromIndex] = useState(0);
  const [invitationsIsLoading, setInvitationsIsLoading] = useState(false);
  const [pointsIsLoading, setPointsIsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    if (props.activeTabName) {
      switch (props.activeTabName) {
        case "prediction":
        case "predictions":
          setActiveTab(1);
          break;
        case "post":
        case "posts":
          setActiveTab(0);
          break;
        case "invitation":
        case "invitations":
          if (!props.isPublic) {
            setActiveTab(2);
          }
          break;
        case "point":
        case "points":
          if (!props.isPublic) {
            setActiveTab(3);
          }
          break;

        default:
          break;
      }
    }
    // fix react 18 strict mode: https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
    if (!effectRef.current) {
      fetchMoreTweetsData();
      fetchMorePredictionsData();
      if (!props.isPublic) {
        fetchMoreInvitationsData();
        fetchMorePointsData();
      }
    }
    return () => (effectRef.current = true);
  }, []);

  useImperativeHandle(ref, () => ({
    refreshPredictions() {
      fetchMorePredictionsData(true);
    },
  }));

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

  const fetchMorePredictionsData = (isReset?: boolean) => {
    if (predictionsIsLoading) return;
    if (isReset) {
      setPredictions([]);
      setPredictionsFromIndex(0);
      setPredictionsHasMore(true);
    }

    setPredictionsIsLoading(true);
    axios
      .get(`/v0/public/predictions?from=${isReset ? 0 : predictionsFromIndex}&size=${pageSize}&alias=${props.alias}`)
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setPredictions((prevItems: PredictionPropType[]) => [...prevItems, ...res.data.data]);
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

  const fetchMoreInvitationsData = (isReset?: boolean) => {
    if (invitationsIsLoading) return;
    if (isReset) {
      setInvitations([]);
      setInvitationsFromIndex(0);
      setInvitationsHasMore(true);
    }
    // setInvitations([
    //   {
    //     name: "fdsafsa",
    //     alias: "fdsaf",
    //   },
    //   {
    //     name: "fdsafsa2",
    //     alias: "fdsa2f",
    //   },
    // ]);
    if (!localStorage.getItem("insights_token")) {
      return null;
    }
    setInvitationsIsLoading(true);
    axios
      .get(`/v0/api/user/my-invited?from=${isReset ? 0 : invitationsFromIndex}&size=${pageSize}`, {
        headers: {
          Authorization: localStorage.getItem("insights_token"),
        },
      })
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setInvitations((prevItems: any[]) => [...prevItems, ...res.data.data]);
          setInvitationsFromIndex((prevIndex) => prevIndex + res.data.data.length);
          setInvitationsHasMore(res.data.data.length >= pageSize);
        } else {
          setInvitationsHasMore(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setInvitationsIsLoading(false);
      });
  };

  const fetchMorePointsData = (isReset?: boolean) => {
    if (pointsIsLoading) return;
    if (isReset) {
      setPoints([]);
    }
    if (!localStorage.getItem("insights_token")) {
      return null;
    }
    setPointsIsLoading(true);
    axios
      .get(`/v0/api/user/credit/records`, {
        headers: {
          Authorization: localStorage.getItem("insights_token"),
        },
      })
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setPoints((prevItems: any[]) => [...prevItems, ...res.data.data]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setPointsIsLoading(false);
      });
  };

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(window.location.origin + "?i=" + props.invitationCode);
    toast.success(t("Copied"), toastConfig);
  };

  return (
    <div className="flex w-full flex-col">
      <div role="tablist" className="tabtitle tabs tabs-bordered w-full max-w-5xl px-2 pt-2">
        <div role="tab" className={`tab ${activeTab === 1 ? "tab-active" : ""}`} onClick={() => handleTabClick(1)}>
          {t("Predictions")}
        </div>
        <div role="tab" className={`tab ${activeTab === 0 ? "tab-active" : ""}`} onClick={() => handleTabClick(0)}>
          {t("Posts")}
        </div>
        {!props.isPublic && props.invitationCode && (
          <div role="tab" className={`tab ${activeTab === 2 ? "tab-active" : ""}`} onClick={() => handleTabClick(2)}>
            {t("Invitation")}
          </div>
        )}
        {!props.isPublic && (
          <div role="tab" className={`tab ${activeTab === 3 ? "tab-active" : ""}`} onClick={() => handleTabClick(3)}>
            {t("Points")}
          </div>
        )}
      </div>
      <div className="w-full">
        {activeTab === 0 ? (
          <InfiniteScroll
            dataLength={tweets.length}
            next={fetchMoreTweetsData}
            hasMore={tweetsHasMore}
            loader={<Loading />}
            endMessage={<p className="text-center py-2">{t("PostsEndMessage")}</p>}
          >
            <div className="flex flex-col items-center justify-between w-full pt-2">
              {tweets.map((t, i) => (
                <Tweet {...t} key={i} />
              ))}
            </div>
          </InfiniteScroll>
        ) : activeTab === 1 ? (
          <InfiniteScroll
            dataLength={predictions.length}
            next={fetchMorePredictionsData}
            hasMore={predictionsHasMore}
            loader={<Loading />}
            endMessage={<p className="text-center py-2">{t("PredictionsEndMessage")}</p>}
          >
            <div className="flex flex-col items-center justify-between w-full pt-2">
              {predictions.map((t, i) => (
                <Prediction {...t} key={i} />
              ))}
            </div>
          </InfiniteScroll>
        ) : activeTab === 2 ? (
          !props.isPublic && (
            <InfiniteScroll
              dataLength={invitations.length}
              next={fetchMoreInvitationsData}
              hasMore={invitationsHasMore}
              loader={<Loading />}
              endMessage={<p className="text-center py-2">{t("PredictionsEndMessage")}</p>}
            >
              <div className="flex flex-row items-center justify-center w-full py-4">
                <label className="form-control w-full bg-white">
                  <div className="label">
                    <span className="label-text">{t("InvitationLink")}</span>
                    <span className="label-text-alt"></span>
                  </div>
                  <input
                    type="text"
                    placeholder={t("InvitationLink")}
                    value={window.location.origin + "?i=" + props.invitationCode}
                    readOnly={true}
                    onFocus={(e) => e.target.select()}
                    onClick={copyInvitationLink}
                    className="input input-bordered w-full bg-white outline-0"
                  />
                  <div className="label">
                    <span className="label-text-alt"></span>
                    <span className="label-text-alt">
                      <button className="btn btn-primary btn-sm text-white" onClick={copyInvitationLink}>
                        {t("CopyLink")}
                      </button>
                    </span>
                  </div>
                </label>
              </div>
              <div className="flex flex-col items-center justify-between w-full pt-2">
                <h3 className="font-bold">{t("MyInvitations")}</h3>
                <ul className="w-full">
                  {invitations.map((t, i) => (
                    <li key={i} className="flex flex-row items-center justify-between w-full py-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            {t.avatarUrl ? (
                              <img
                                src={t.avatarUrl}
                                alt={t.name ? t.name : t("Anonymous")}
                                onError={(e) => (e.currentTarget.src = "/insights-logo-icon.svg")}
                              />
                            ) : (
                              parse(multiavatar(t.name ? filterString(t.name) : t("Anonymous")))
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
                          <div className="text-base font-bold">
                            {/*TODO alias*/}
                            <Link href={"/user/" + t?.alias} className="link">
                              {t.name ? t.name : t("Anonymous")}
                            </Link>
                            <span className="font-normal ml-2 text-sm">
                              @{t.alias ? t.alias : t("Anonymous")}
                              &nbsp;{t.address ? t.address : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        {t.createTime ? dateFormat(t.createTime) : new Date().toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </InfiniteScroll>
          )
        ) : (
          !props.isPublic && (
            <div className="flex flex-col items-center justify-between w-full pt-2 overflow-x-auto">
              <h3 className="font-bold py-2">{t("PointsList")}</h3>
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>{t("PointsType")}</th>
                    <th className="text-right">{t("PointsAmount")}</th>
                    <th className="text-right">{t("PointsTime")}</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((p, i) => (
                    <tr key={i}>
                      <td>{t(p.source)}</td>
                      <td className="text-right">{p.amount}</td>
                      <td className="text-right">
                        {p.createTime ? dateFormat(p.createTime) : new Date().toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
});
ProfileTab.displayName = "ProfileTab";

export default ProfileTab;
