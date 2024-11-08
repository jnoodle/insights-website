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
import { Avatar } from "@/components/Avatar";

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
  accuracy?: any;
  tweet?: TwitterUser;
  createTime?: string;
  updateTime?: string;
  id?: string;
  wallet?: string;
  isOperator?: boolean;
  operationalRole?: string;
  invitationCode?: string;
  invitedBy?: string;
  uid?: string;
  credit?: number;
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

// https://developer.x.com/en/docs/twitter-api/data-dictionary/object-model/tweet
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
      <div className="tweet-item">
        <div className="user flex w-full justify-start items-center">
          <Avatar className="user-avatar" user={insightUser} />
          <div className="username flex flex-col lg:flex-row">
            <div className="user-name">
              <Link href={"/user/" + insightUser?.alias} className="link">
                {insightUser.name ? insightUser.name : t("Anonymous")}
              </Link>
            </div>
            <div className="x-user">
              <div className="avatar">
                <div className="w-7 rounded-full">
                  <img
                    src={tweetAuthor && tweetAuthor.profileImageUrl ? tweetAuthor.profileImageUrl : "/X_black.svg"}
                    alt={tweetAuthor && tweetAuthor.name ? tweetAuthor.name : t("Anonymous")}
                    onError={(e) => (e.currentTarget.src = "/insights-logo-icon.svg")}
                  />
                </div>
              </div>
              <Link href={"https://x.com/" + tweetAuthor!.screenName} target="_blank" className="link">
                {tweetAuthor && tweetAuthor.name ? tweetAuthor.name : t("Anonymous")}
              </Link>
              <Link href={"https://x.com/" + tweetAuthor!.screenName} target="_blank" className="link">
                @{tweetAuthor && tweetAuthor.screenName ? tweetAuthor.screenName : "anonymous"}
              </Link>
              {props.retweet && props.retweet.user && (
                <div className="reposted flex font-bold items-center ml-2 whitespace-nowrap">
                  <Image src="/reposted.svg" alt={t("reposted")} width={12} height={12} priority className="mr-2" />
                  {t("reposted")}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="tweet flex flex-col justify-between items-center">
          <div className="tweet-content">
            {parse(
              twitter
                .autoLink(twitter.htmlEscape(props.text || "#hello < @world >"), {
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
                })
                .replace(/\n/g, "<br />") || "",
            )}
            {props.media && props.media.length > 0 ? (
              <div className="flex gap-2 mt-2 w-full flex-wrap">
                {props.media.map((m: any, i: any) =>
                  m.mediaUrlHttps ? (
                    <img src={m.mediaUrlHttps} key={i} className="max-w-40 max-h-40 lg:max-w-80 lg:max-h-80" />
                  ) : null,
                )}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col w-full border-t border-t-base-100 mt-2 pt-2 gap-1 lg:gap-2 lg:mt-4 lg:pt-4">
            {props.hashtags && props.hashtags.length > 0 && (
              <div className="tweet-tags flex w-full text-xs text-neutral items-center gap-x-1 lg:gap-x-2">
                {props.hashtags.map((h, i) => (
                  <Link href={"https://x.com/hashtag/" + h} target="_blank" className="link" key={i}>
                    #{h}
                  </Link>
                ))}
              </div>
            )}
            {props.coins && props.coins.length > 0 && (
              <div className="insights">
                {t("Insights")}:{" "}
                {props.coins.map((c, i) => (
                  <span className="mx-1" key={i}>
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className="date">{props.createAt ? dateFormat(props.createAt) : new Date().toLocaleString()}</div>
          </div>
        </div>
        <div className="flex flex-row justify-end items-center w-full gap-x-2 lg:gap-x-4">
          {currentUserIsOperator && (
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <button
                className="tweet-more btn btn-error btn-md text-sm font-bold rounded-full"
                disabled={btnDeleteLoading}
                onClick={() => handleDeleteTweet(props.id)}
              >
                {t("Delete")} {btnDeleteLoading && <span className="loading loading-spinner loading-xs"></span>}
              </button>
            </div>
          )}
          <Link
            href={`https://x.com/${tweetAuthor.screenName}/status/${props.tweetId}`}
            className="tweet-more btn btn-primary btn-md text-sm font-bold rounded-full"
            target="_blank"
          >
            {t("ViewMore")}
          </Link>
        </div>
      </div>
    )
  );
}
