"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ProfileTab from "@/components/ProfileTab";
import { ellipseAddress, filterString, toastConfig } from "@/app/utils";
import { useAccount, useAccountEffect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { getMyProfile, Login, updateUserName, getBindTwitterUri } from "@/api/user";
import multiavatar from "@multiavatar/multiavatar/esm";
import parse from "html-react-parser";
import { InsightsUser } from "@/components/Tweet";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AddPrediction } from "@/components/AddPrediction";
import { useTranslations } from "next-intl";
import { reservedWords, userNameRegex } from "@/app/constants";
import { toast } from "react-toastify";
import numeral from "numeral";
import { useSearchParams } from "next/navigation";

dayjs.extend(customParseFormat);

export default function Home() {
  const t = useTranslations("Pages");
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [currentUser, setCurrentUser]: [InsightsUser, any] = useState({});
  const [activeTabName, setActiveTabName] = useState("");
  const [loading, setLoading] = useState(false);
  const [bindTwitterLoading, setBindTwitterLoading] = useState(false);
  const effectRef = useRef(false);
  const profileTabRef = useRef();
  const searchParams = useSearchParams();

  useEffect((): any => {
    if (searchParams && searchParams.get("t")) {
      setActiveTabName(searchParams.get("t")!);
    }
    if (address) {
      if (!loading) {
        // Login(address).then(() => {
        setLoading(true);
        getMyProfile()
          .then((res) => {
            if (res.data) {
              setCurrentUser(res.data);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
      // });
    } else {
      // setCurrentUser({});
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

  const editUserName = () => {
    const userName = prompt(t("EditUserNamePrompt"), currentUser?.name || "");
    if (userName) {
      console.log("userName", userName, userName.length, userNameRegex.test(userName));
      if (userName.length >= 3 && userNameRegex.test(userName) && reservedWords.indexOf(userName.toLowerCase()) < 0) {
        updateUserName(userName).then((isSuccess) => {
          console.log("isSuccess", isSuccess);
          if (isSuccess) {
            setCurrentUser({
              ...currentUser,
              name: userName,
            });
          }
        });
      } else {
        toast.error(t("EditUserNameInvalid"), toastConfig);
      }
    }
  };

  // bind twitter step1: get twitter uri
  const bindTwitterAccount = () => {
    if (bindTwitterLoading || (currentUser.tweet && currentUser.tweet.name)) return;

    setBindTwitterLoading(true);
    getBindTwitterUri()
      .then((uri) => {
        if (uri) {
          window.location.href = uri;
        } else {
          setBindTwitterLoading(false);
          toast.error(t("GetBindTwitterUriError"), toastConfig);
        }
      })
      .catch((err) => {
        console.error(err);
        setBindTwitterLoading(false);
        toast.error(t("GetBindTwitterUriError"), toastConfig);
      });
  };

  // @ts-ignore
  return (
    <div className="flex flex-col items-center justify-between w-full pt-4">
      <h1 className="text-xl text-accent font-bold md:mb-4 mb-2">{t("MyProfileTitle")}</h1>
      {!isConnected && (
        <div role="alert" className="alert alert-warning">
          <span>{t("NotConnectWallet")}</span>
        </div>
      )}
      {loading && (
        <h1>
          <span className="loading loading-spinner loading-lg"></span>
        </h1>
      )}
      {isConnected && currentUser && currentUser.alias && (
        <>
          <div className="flex items-center gap-2 md:gap-4 w-full md:flex-row flex-col">
            <div className="avatar">
              <div className="w-20 md:w-32 rounded-full">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name ? currentUser.name : t("Anonymous")}
                    onError={(e) => (e.currentTarget.src = "/insights-logo-icon.svg")}
                  />
                ) : (
                  parse(multiavatar(currentUser.alias || t("Anonymous")))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 md:w-auto w-11/12">
              <div className="flex items-center gap-1">
                <span className={`text-xl font-bold ${currentUser.isOperator ? "text-orange-600" : "text-accent"}`}>
                  {currentUser.name}
                </span>
                {currentUser.isOperator && (
                  <div className="tooltip" data-tip={t("AdministratorTip")}>
                    <Image src="/operation.svg" alt={t("AdministratorTip")} width={32} height={32} priority />
                  </div>
                )}
                <button className="btn btn-circle btn-sm" onClick={editUserName}>
                  <Image src="/edit.svg" alt="" priority width={18} height={18} />
                </button>
              </div>
              <div className="">@{currentUser.alias}</div>
              {/*<div className="">*/}
              {/*  <Accuracy accuracy={currentUser.accuracy} />*/}
              {/*</div>*/}
              <div className="">
                {t("Points")}:{" "}
                <span className="text-lg font-bold">{numeral(currentUser.credit || 0).format("0,0")}</span>
              </div>
              <div className="">
                {t("Address")}:{" "}
                <span className="text-primary cursor-pointer" onClick={() => open({ view: "Account" })}>
                  {ellipseAddress(address)}
                </span>
              </div>
              <div className="">
                {t("Twitter")}:{" "}
                {currentUser.tweet && currentUser.tweet.name ? (
                  <span>
                    <Link href={"https://twitter.com/" + currentUser.tweet!.screenName} target="_blank">
                      {currentUser.tweet && currentUser.tweet.name ? currentUser.tweet.name : t("Anonymous")} @
                      {currentUser.tweet && currentUser.tweet.screenName ? currentUser.tweet.screenName : "anonymous"}
                    </Link>
                  </span>
                ) : (
                  <>
                    --
                    <button
                      onClick={bindTwitterAccount}
                      disabled={bindTwitterLoading}
                      className="btn btn-primary btn-sm text-white font-normal ml-2"
                    >
                      {t("BindTwitter")}
                      {bindTwitterLoading ? <span className="loading loading-spinner loading-xs"></span> : ""}
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-2 flex-col md:flex-row">
                <Link href="/" className="btn btn-primary btn-sm text-white font-normal">
                  {t("BackToHome")}
                </Link>
                <Link href={"/user/" + currentUser.alias} className="btn btn-primary btn-sm text-white font-normal">
                  {t("GoToMyPage")}
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
          {currentUser && currentUser.alias && (
            <ProfileTab
              alias={currentUser.alias}
              invitationCode={currentUser.invitationCode}
              ref={profileTabRef}
              activeTabName={activeTabName}
            />
          )}
        </div>
      )}
    </div>
  );
}
