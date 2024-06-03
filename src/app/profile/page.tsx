"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ProfileTab from "@/components/ProfileTab";
import { ellipseAddress, filterString, toastConfig } from "@/app/utils";
import { useAccount, useAccountEffect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { getMyProfile, Login } from "@/api/user";
import multiavatar from "@multiavatar/multiavatar/esm";
import parse from "html-react-parser";
import { InsightsUser } from "@/components/Tweet";
import { DatePicker, Radio, Select, Input, Modal } from "antd";
import { CmcCoinInfo } from "@/components/Prediction";
import DebounceSelect from "@/components/DebounceSelect";
import { getCoins } from "@/api/public";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { toast } from "react-toastify";

dayjs.extend(customParseFormat);

const { TextArea } = Input;
export interface CoinValue {
  label: string;
  value: string;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [currentUser, setCurrentUser]: [InsightsUser, any] = useState({});
  const effectRef = useRef(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const profileTabRef = useRef();

  useEffect((): any => {
    if (address) {
      // Login(address).then(() => {
      getMyProfile().then((res) => {
        if (res.data) {
          setCurrentUser(res.data);
        }
      });
      // });
    }
  }, [address]);

  // useAccountEffect({
  //   async onConnect(data) {
  //     console.log("profile page");
  //     console.log(data);
  //     if (data.address) {
  //       console.log("profile login");
  //       await Login(data.address);
  //       const profile = await getMyProfile();
  //       console.log("profile get info", profile);
  //       if (profile && profile.data) {
  //         setCurrentUser(profile.data);
  //       }
  //     }
  //   },
  // });

  const openAddPrediction = () => {
    // TODO
    if (currentUser && ((currentUser.tweet && currentUser.tweet.name) || currentUser.isOperator)) {
      setIsPredictionModalOpen(true);
    } else {
      toast.error("This feature only supports verified users.", toastConfig);
    }
  };
  const closeAddPrediction = () => {
    setIsPredictionModalOpen(false);
  };

  const [coinValue, setCoinValue] = useState<CoinValue | null>(null);
  const [predictionTime, setPredictionTime] = useState("");
  const [predictionTrend, setPredictionTrend] = useState("rise");
  const [predictionTweetUrl, setPredictionTweetUrl] = useState("");
  const [predictionExplanation, setPredictionExplanation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const resetPredictionForm = () => {
    setCoinValue(null);
    setPredictionTime("");
    setPredictionTrend("rise");
    setPredictionExplanation("");
    setPredictionTweetUrl("");
    setErrorMsg("");
  };

  const addPrediction = () => {
    setErrorMsg("");
    setAddLoading(false);
    // form valid
    if (!coinValue || (coinValue && !coinValue.value)) {
      setErrorMsg("Please select the currency for prediction.");
      return;
    }
    if (!predictionTime) {
      setErrorMsg("Please select the latest time of the price prediction result achievement.");
      return;
    }
    setAddLoading(true);
    // console.log(coinValue);
    const prediction = {
      coin: JSON.parse(coinValue!.value),
      resultAchievementTime: predictionTime,
      trend: predictionTrend,
      explanation: predictionExplanation,
      tweetUrl: predictionTweetUrl,
    };

    // console.log(prediction);

    axios
      .post(
        "/v0/api/user/prediction/create",
        {
          ...prediction,
        },
        {
          headers: {
            Authorization: localStorage.getItem("insights_token"),
          },
        },
      )
      .then((res: any) => {
        if (res.data) {
          console.log(res.data);
          if (res.data.code === 0) {
            resetPredictionForm();
            toast.success("Adding prediction success.", toastConfig);
            if (profileTabRef.current) {
              // @ts-ignore
              profileTabRef.current.refreshPredictions();
            }
          } else {
            setErrorMsg(`Code ${res.data.code} Error` || "Internal error.");
          }
        } else {
          setErrorMsg("Network error.");
        }
      })
      .catch((err: any) => {
        console.error(err);
        setErrorMsg(err.message);
      })
      .finally(() => {
        setAddLoading(false);
      });
  };

  // @ts-ignore
  return (
    <div className="flex flex-col items-center justify-between w-full pt-4">
      <h1 className="text-xl text-accent font-bold md:mb-4 mb-2">My Profile</h1>
      {!isConnected && (
        <div role="alert" className="alert alert-warning">
          <span>Please connect wallet!</span>
        </div>
      )}
      {isConnected && currentUser && currentUser.alias && (
        <>
          <div className="flex items-center gap-2 md:gap-4 w-full md:flex-row flex-col">
            <div className="avatar">
              <div className="w-20 md:w-32 rounded-full">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name ? currentUser.name : "Anonymous"} />
                ) : (
                  parse(multiavatar(currentUser.alias || "Anonymous"))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 md:w-auto w-11/12">
              <div className="flex items-center gap-1">
                <span className={`text-xl font-bold ${currentUser.isOperator ? "text-orange-600" : "text-accent"}`}>
                  {currentUser.name}
                </span>
                {currentUser.isOperator && (
                  <div className="tooltip" data-tip="Operations Administrator">
                    <Image src="/operation.svg" alt="Operations Administrator" width={32} height={32} priority />
                  </div>
                )}
              </div>
              <div className="">@{currentUser.alias}</div>
              {/*<div className="">*/}
              {/*  <Accuracy accuracy={currentUser.accuracy} />*/}
              {/*</div>*/}
              <div className="">
                Address:{" "}
                <span className="text-primary cursor-pointer" onClick={() => open({ view: "Account" })}>
                  {ellipseAddress(address)}
                </span>
              </div>
              <div className="">
                Twitter:{" "}
                {currentUser.tweet && currentUser.tweet.name ? (
                  <span>
                    <Link href={"https://twitter.com/" + currentUser.tweet!.screenName} target="_blank">
                      {currentUser.tweet && currentUser.tweet.name ? currentUser.tweet.name : "Anonymous"} @
                      {currentUser.tweet && currentUser.tweet.screenName ? currentUser.tweet.screenName : "anonymous"}
                    </Link>
                  </span>
                ) : (
                  "/"
                )}
              </div>
              <div className="flex gap-2 mt-2 flex-col md:flex-row">
                <Link href={"/user/" + currentUser.alias} className="btn btn-primary btn-sm text-white font-normal">
                  Go to My Page
                </Link>
                {((currentUser.tweet && currentUser.tweet.name) || currentUser.isOperator) && (
                  <button className="btn btn-primary btn-sm text-white font-normal" onClick={openAddPrediction}>
                    Add Prediction
                  </button>
                )}
                {/*TODO*/}
                {/*{(!currentUser.tweet || !currentUser.tweet.name) && (*/}
                {/*  <a href="#" target="_blank" className="btn btn-success btn-sm text-white font-normal">*/}
                {/*    Apply to bind Twitter and join Insights &gt;&gt;*/}
                {/*  </a>*/}
                {/*)}*/}
                {/*<button className="btn btn-primary btn-sm text-white">Add Tweet</button>*/}
              </div>
            </div>
          </div>
        </>
      )}
      {isConnected && (
        <div className="flex items-center w-full mt-6">
          {currentUser && currentUser.alias && <ProfileTab alias={currentUser.alias} ref={profileTabRef} />}
        </div>
      )}
      <Modal title="Add Prediction" open={isPredictionModalOpen} footer={null} onCancel={closeAddPrediction}>
        <div className="flex w-full flex-col gap-4 py-2">
          <div className="flex flex-col">
            <DebounceSelect
              showSearch
              value={coinValue}
              placeholder="Search Token by Name / Symbol / Address"
              fetchOptions={getCoins}
              onChange={(newValue) => {
                setCoinValue(newValue as CoinValue);
              }}
              // allowClear={true}
              style={{ width: "100%", height: 70 }}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="border-t border-secondary py-2 px-4 text-xs italic text-neutral">
                    Symbol (PriceUsd) (Name) (Chain: Contract Address)
                  </div>
                </>
              )}
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">
              <a href="https://dexscreener.com/" target="_blank">
                DEX Screener
              </a>{" "}
              provides the search service.
            </span>
          </div>
          <div className="flex flex-col">
            <DatePicker
              showTime
              placeholder="Select the latest time of the price prediction result achievement"
              onOk={(value) => setPredictionTime(value.format("YYYY-MM-DDTHH:mm:ss"))}
              minDate={dayjs(dayjs(new Date()).add(1, "day"), "YYYY-MM-DD")}
              maxDate={dayjs(dayjs(new Date()).add(8, "day"), "YYYY-MM-DD")}
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">
              You can manually complete the prediction at any time before this time, and we will judge the accuracy
              based on the price at the time of manual completion. If not manually completed, the accuracy will be
              judged based on the price at this time.
            </span>
          </div>
          <Radio.Group onChange={(e) => setPredictionTrend(e.target.value)} value={predictionTrend}>
            <span>Trend Prediction: </span>
            <Radio value="rise">
              <span className="text-success text-lg">Rise ↗</span>
            </Radio>
            <Radio value="fall">
              <span className="text-error text-lg">Fall ↘</span>
            </Radio>
          </Radio.Group>

          <div className="flex flex-col">
            <TextArea
              value={predictionTweetUrl}
              onChange={(e) => setPredictionTweetUrl(e.target.value.trim())}
              placeholder="Prediction source tweet URL: https://x.com/xxx (optional)"
              autoSize
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">
              You can input the link to your prediction-related tweet.
            </span>
          </div>
          <div className="flex flex-col">
            <TextArea
              value={predictionExplanation}
              onChange={(e) => setPredictionExplanation(e.target.value.trim())}
              placeholder="Prediction explanation (optional)"
              autoSize
            />
            <span className="text-gray-500 mt-0 text-xs mb-1">You can input the prediction explanation.</span>
          </div>
          {errorMsg && <div className="text-error text-xs">{errorMsg}</div>}
          <div>
            <button className="btn btn-primary btn-sm text-white font-normal max-w-36" onClick={addPrediction}>
              Add Prediction
            </button>
            <button className="btn btn-sm ml-2 font-normal max-w-36" onClick={closeAddPrediction}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
