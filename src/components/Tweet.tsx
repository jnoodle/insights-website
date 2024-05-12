import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import twitter from "twitter-text";
import parse from "html-react-parser";
import numeral from "numeral";
import { filterString, utcLocal } from "@/app/utils";
import multiavatar from "@multiavatar/multiavatar/esm";

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
  userView?: InsightsUser;

  // tweet data
  id?: string;
  createTime?: string;
  tweetId?: string;
  createAt?: string;
  text?: string;
  lang?: string;
  replayCount?: number;
  favoriteCount?: number;
  viewCount?: number;
  hashtags?: string[];
  retweet?: boolean;
  media?: any;

  // insights data
  coins?: string[];
};
export function Tweet(props: TweetPropType) {
  return (
    <div className="flex flex-col w-full px-2 pt-4 pb-4 text-sm border-b border-b-secondary">
      <div className="author flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="avatar">
            <div className="w-12 rounded-full">
              {props.userView && props.userView.avatarUrl ? (
                <img
                  src={props.userView.avatarUrl}
                  alt={props.userView && props.userView.name ? props.userView.name : "Anonymous"}
                />
              ) : (
                parse(
                  multiavatar(props.userView && props.userView.name ? filterString(props.userView.name) : "Anonymous"),
                )
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
            <div className="text-base font-bold">
              {/*TODO alias*/}
              <Link href={"/user/" + props.userView?.alias} className="link">
                {props.userView && props.userView.name ? props.userView.name : "Anonymous"}
              </Link>
            </div>
            {/*<div>@{props.user && props.user.screenName ? props.user.screenName : "anonymous"}</div>*/}
          </div>
        </div>
        <div className="date hidden md:block">
          {props.createAt ? utcLocal(props.createAt) : new Date().toLocaleString()}
        </div>
      </div>
      <div className="tweet flex justify-between items-center md:border-l border-l-secondary mt-2 ml-0 md:ml-5 pl-1 md:pl-5">
        <div className="flex w-full flex-col items-start justify-start gap-2">
          {props.coins && props.coins.length > 0 && (
            <div className="insights flex font-bold items-center py-1">
              Insights:{" "}
              {props.coins.map((c, i) => (
                <span className="text-primary text-base mx-1" key={i}>
                  {c}
                </span>
              ))}
            </div>
          )}
          {props.retweet && (
            <div className="reposted flex font-bold">
              <Image src="/reposted.svg" alt="reposted" width={12} height={12} priority className="mr-2" />
              {props.user && props.user.name ? props.user.name : "Anonymous"} reposted
            </div>
          )}
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-7 rounded-full">
                  <img
                    src={props.user && props.user.profileImageUrl ? props.user.profileImageUrl : "/X_black.svg"}
                    alt={props.user && props.user.name ? props.user.name : "Anonymous"}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-0 md:gap-2 items-start md:items-center">
                <div className="font-bold text-accent">
                  <Link href={"https://twitter.com/" + props.user!.screenName} target="_blank">
                    {props.user && props.user.name ? props.user.name : "Anonymous"}
                  </Link>
                </div>
                <div>@{props.user && props.user.screenName ? props.user.screenName : "anonymous"}</div>
              </div>
            </div>
            <Link
              href={"https://twitter.com/i/web/status/" + props.tweetId}
              className="link hidden md:block"
              target="_blank"
            >
              View more
            </Link>
          </div>
          <div>
            {parse(
              twitter.autoLink(twitter.htmlEscape(props.text || "#hello < @world >"), {
                targetBlank: true,
                urlEntities: props.media.map((m: any) => ({
                  id: m.id,
                  url: m.url,
                  type: m.type,
                  display_url: m.displayUrl,
                  expanded_url: m.expandedUrl,
                  media_key: m.mediaKey,
                  media_url_https: m.mediaUrlHttps,
                  indices: m.indices,
                  sizes: m.sizes,
                })),
              }) || "",
            )}
            {props.media.length > 0 ? (
              <div className="flex gap-2 mt-1 w-full flex-wrap">
                {props.media.map((m: any) =>
                  m.mediaUrlHttps ? <img src={m.mediaUrlHttps} className="max-w-80 max-h-80" /> : null,
                )}
              </div>
            ) : null}
          </div>
          <div className="flex w-full text-xs text-neutral items-center border-t border-t-base-100 pt-2">
            <span className="text-neutral">{numeral(props.viewCount || 0).format("0a")}</span>
            <span className="ml-1">Views</span>
            <span className="ml-3 text-neutral">{numeral(props.replayCount || 0).format("0a")}</span>
            <span className="ml-1">
              <Image src="/reply.svg" width={12} height={12} priority alt="Reply" />
            </span>
            <span className="ml-3 text-neutral">{numeral(props.favoriteCount || 0).format("0a")}</span>
            <span className="ml-1">
              <Image src="/like.svg" width={12} height={12} priority alt="Like" />
            </span>
            {props.hashtags && props.hashtags.length > 0 && (
              <span className="ml-3 text-primary">
                {props.hashtags.map((h) => (
                  <Link href={"https://twitter.com/hashtag/" + h} target="_blank" className="mr-2" key={h}>
                    #{h}
                  </Link>
                ))}
              </span>
            )}
          </div>
          <div className="flex w-full justify-between md:hidden">
            <div className="date text-xs">
              {props.createAt ? utcLocal(props.createAt) : new Date().toLocaleString()}
            </div>
            <Link href={"https://twitter.com/i/web/status/" + props.tweetId} className="link" target="_blank">
              View more
            </Link>
          </div>
        </div>
      </div>
      {/*<div>{JSON.stringify(props)}</div>*/}
    </div>
  );
}
