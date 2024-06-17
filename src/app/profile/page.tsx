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
import { CmcCoinInfo, DexCoinInfo } from "@/components/Prediction";
import DebounceSelect from "@/components/DebounceSelect";
import { getCoins } from "@/api/public";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { toast } from "react-toastify";
import { TokenDropdownRender } from "@/components/TokenLabel";
import { AddPrediction } from "@/components/AddPrediction";

dayjs.extend(customParseFormat);

export default function Home() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [currentUser, setCurrentUser]: [InsightsUser, any] = useState({});
  const effectRef = useRef(false);
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
    } else {
      setCurrentUser({});
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

  const addPredictionSuccess = () => {
    if (profileTabRef.current) {
      // @ts-ignore
      profileTabRef.current.refreshPredictions();
    }
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
                <Link href="/" className="btn btn-primary btn-sm text-white font-normal">
                  Back to Home
                </Link>
                <Link href={"/user/" + currentUser.alias} className="btn btn-primary btn-sm text-white font-normal">
                  Go to My Page
                </Link>
                <AddPrediction onSuccess={addPredictionSuccess} currentUserInfo={currentUser} />
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
    </div>
  );
}
