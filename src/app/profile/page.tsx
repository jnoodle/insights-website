"use client";

import React, { useEffect, useRef, useState } from "react";
import { ProfileTab } from "@/components/ProfileTab";
import { ellipseAddress, filterString } from "@/app/utils";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { getMyProfile } from "@/api/user";
import multiavatar from "@multiavatar/multiavatar/esm";
import parse from "html-react-parser";
import { InsightsUser } from "@/components/Tweet";
import { Accuracy } from "@/components/Accuracy";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [currentUser, setCurrentUser]: [InsightsUser, any] = useState({});
  const effectRef = useRef(false);

  useEffect((): any => {
    if (!effectRef.current) {
      getMyProfile().then((res) => {
        if (res.data) {
          setCurrentUser(res.data);
        }
      });
    }
    return () => (effectRef.current = true);
  }, []);

  const openAddPrediction = () => {
    // @ts-ignore
    document.getElementById("addPrediction").showModal();
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
                  parse(multiavatar(currentUser.name ? filterString(currentUser.name) : "Anonymous"))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 md:w-auto w-11/12">
              <div className="text-xl font-bold text-accent">{currentUser.name}</div>
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
                {currentUser.tweet && currentUser.tweet.name && (
                  <button className="btn btn-primary btn-sm text-white font-normal" onClick={openAddPrediction}>
                    Add Prediction
                  </button>
                )}
                {/*<button className="btn btn-primary btn-sm text-white">Add Tweet</button>*/}
              </div>
            </div>
          </div>
        </>
      )}
      {isConnected && (
        <div className="flex items-center w-full mt-6">
          {currentUser && currentUser.alias && <ProfileTab alias={currentUser.alias} />}
        </div>
      )}
      <dialog id="addPrediction" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Add Prediction</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
        </div>
      </dialog>
    </div>
  );
}
