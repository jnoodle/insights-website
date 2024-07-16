import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import twitter from "twitter-text";
import parse from "html-react-parser";
import numeral from "numeral";
import { filterString, dateFormat, toastConfig } from "@/app/utils";
import multiavatar from "@multiavatar/multiavatar/esm";
import { useState } from "react";
import { deleteItem } from "@/api/func";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export type TwitterUser = {
  id?: string;
  name?: string;
  screenName?: string;
  profileImageUrl?: string;
};

export type InsightsUser = {
  alias?: string;
  avatarUrl?: string;
  name?: string;
  accuracy?: string;
  tweet?: TwitterUser;
  createTime?: string;
  updateTime?: string;
  id?: string;
  wallet?: string;
  isOperator?: boolean;
  operationalRole?: string;
};

// export type TweetMedia = {
//   id?: string;
//   type?: string;
//   url?: string;
//   displayUrl?: string;
//   expandedUrl?: string;
//   mediaKey?: string;
//   mediaUrlHttps?: string;
// };

// https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet
export type TweetPropType = {
  user?: TwitterUser;
  userView: InsightsUser;

  // tweet data
  id: string;
  createTime?: string;
  tweetId?: string;
  createAt?: string;
  text?: string;
  lang?: string;
  replayCount?: number;
  favoriteCount?: number;
  viewCount?: number;
  hashtags?: string[];
  retweet?: any;
  media?: any;

  // insights data
  coins?: string[];
};
export function Tweet(props: TweetPropType) {
  const t = useTranslations("Tweet");
  const insightUser = props.userView;
  const tweetUser = props.userView.tweet;
  const tweetAuthor = props.retweet && props.retweet.user ? props.retweet.user : props.userView.tweet;
  const currentUserIsOperator = sessionStorage.getItem("insights_user_r") === "op";

  const [isDeleted, setIsDeleted] = useState(false);
  const [btnDeleteLoading, setBtnDeleteLoading] = useState(false);

  const handleDeleteTweet = (id: string) => {
    if (window.confirm("Confirm delete this tweet?")) {
      setBtnDeleteLoading(true);
      deleteItem(id, "tweet")
        .then(() => {
          toast.success("Delete tweet success.", toastConfig);
          setIsDeleted(true);
        })
        .catch((e) => {
          toast.error("Delete tweet failed.", toastConfig);
        })
        .finally(() => {
          setBtnDeleteLoading(false);
        });
    }
  };

  return (
    !isDeleted && (
      <div className="flex flex-col w-full px-2 pt-4 pb-4 text-sm border-b border-b-secondary hover:bg-base-200">
        <div className="author flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-12 rounded-full">
                {insightUser.avatarUrl ? (
                  <img src={insightUser.avatarUrl} alt={insightUser.name ? insightUser.name : t("Anonymous")} />
                ) : (
                  parse(multiavatar(insightUser.name ? filterString(insightUser.name) : t("Anonymous")))
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
              <div className="text-base font-bold">
                {/*TODO alias*/}
                <Link href={"/user/" + insightUser?.alias} className="link">
                  {insightUser.name ? insightUser.name : t("Anonymous")}
                </Link>
              </div>
              {/*<div>@{props.user && props.user.screenName ? props.user.screenName : "anonymous"}</div>*/}
            </div>
          </div>
          <div className="date hidden md:block text-neutral">
            {props.createAt ? dateFormat(props.createAt) : new Date().toLocaleString()}
          </div>
        </div>
        <div className="tweet flex justify-between items-center md:border-l border-l-secondary mt-2 ml-0 md:ml-5 pl-1 md:pl-5">
          <div className="flex w-full flex-col items-start justify-start gap-2">
            {props.coins && props.coins.length > 0 && (
              <div className="insights flex font-bold items-center py-1">
                {t("Insights")}:{" "}
                {props.coins.map((c, i) => (
                  <span className="text-primary text-base mx-1" key={i}>
                    {c}
                  </span>
                ))}
              </div>
            )}
            {props.retweet && props.retweet.user && (
              <div className="reposted flex font-bold">
                <Image src="/reposted.svg" alt={t("reposted")} width={12} height={12} priority className="mr-2" />
                {tweetUser && tweetUser.name ? tweetUser.name : t("Anonymous")} {t("reposted")}
              </div>
            )}
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-7 rounded-full">
                    <img
                      src={tweetAuthor && tweetAuthor.profileImageUrl ? tweetAuthor.profileImageUrl : "/X_black.svg"}
                      alt={tweetAuthor && tweetAuthor.name ? tweetAuthor.name : t("Anonymous")}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
                  <div className="font-bold">
                    <Link
                      href={"https://twitter.com/" + tweetAuthor!.screenName}
                      target="_blank"
                      className="link text-accent"
                    >
                      {tweetAuthor && tweetAuthor.name ? tweetAuthor.name : t("Anonymous")}
                    </Link>
                  </div>
                  <div className="text-neutral">
                    @{tweetAuthor && tweetAuthor.screenName ? tweetAuthor.screenName : "anonymous"}
                  </div>
                </div>
              </div>
              <Link
                href={`https://twitter.com/${tweetUser?.screenName}/status/${props.tweetId}`}
                className="link hidden md:block"
                target="_blank"
              >
                {t("ViewMore")}
              </Link>
            </div>
            <div>
              {parse(
                twitter.autoLink(twitter.htmlEscape(props.text || "#hello < @world >"), {
                  targetBlank: true,
                  urlEntities:
                    props.media && props.media.length > 0
                      ? props.media.map((m: any) => ({
                          id: m.id,
                          url: m.url,
                          type: m.type,
                          display_url: m.displayUrl,
                          expanded_url: m.expandedUrl,
                          media_key: m.mediaKey,
                          media_url_https: m.mediaUrlHttps,
                          indices: m.indices,
                          sizes: m.sizes,
                        }))
                      : [],
                }) || "",
              )}
              {props.media && props.media.length > 0 ? (
                <div className="flex gap-2 mt-1 w-full flex-wrap">
                  {props.media.map((m: any, i: any) =>
                    m.mediaUrlHttps ? (
                      <img src={m.mediaUrlHttps} key={i} className="max-w-40 max-h-40 md:max-w-80 md:max-h-80" />
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>
            <div className="flex w-full text-xs text-neutral items-center border-t border-t-base-100 pt-2">
              {/*<span className="text-neutral">{numeral(props.viewCount || 0).format("0a")}</span>*/}
              {/*<span className="ml-1">{t("Views")}</span>*/}
              {/*<span className="ml-3 text-neutral">{numeral(props.replayCount || 0).format("0a")}</span>*/}
              {/*<span className="ml-1">*/}
              {/*  <Image src="/reply.svg" width={12} height={12} priority alt={t("Reply")} />*/}
              {/*</span>*/}
              {/*<span className="ml-3 text-neutral">{numeral(props.favoriteCount || 0).format("0a")}</span>*/}
              {/*<span className="ml-1">*/}
              {/*  <Image src="/like.svg" width={12} height={12} priority alt={t("Like")} />*/}
              {/*</span>*/}
              {props.hashtags && props.hashtags.length > 0 && (
                <span className="text-primary">
                  {props.hashtags.map((h, i) => (
                    <Link href={"https://twitter.com/hashtag/" + h} target="_blank" className="mr-2" key={i}>
                      #{h}
                    </Link>
                  ))}
                </span>
              )}
            </div>
            <div className="flex w-full justify-between md:hidden">
              <div className="date text-xs text-neutral">
                {props.createAt ? dateFormat(props.createAt) : new Date().toLocaleString()}
              </div>
              <Link
                href={`https://twitter.com/${tweetAuthor.screenName}/status/${props.tweetId}`}
                className="link"
                target="_blank"
              >
                {t("ViewMore")}
              </Link>
            </div>
            {currentUserIsOperator && (
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <button
                  className="btn btn-warning btn-xs font-normal"
                  disabled={btnDeleteLoading}
                  onClick={() => handleDeleteTweet(props.id)}
                >
                  {t("Delete")} {btnDeleteLoading && <span className="loading loading-spinner loading-xs"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
        {/*<div>{JSON.stringify(props)}</div>*/}
      </div>
    )
  );
}
