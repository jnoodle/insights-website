"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dateFormat, toastConfig } from "@/app/utils";
import parse from "html-react-parser";
import * as React from "react";
import { deleteItem } from "@/api/func";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export type ArticlePropType = {
  id: string;
  title?: string;
  createTime?: string;
  source?: string;
  sourceLink?: string;
  sourceId?: string;
  sourceCreateTime?: string;
  subject?: string;
  thumbnail?: string;
  content?: string;
  tags?: string;
  author?: string;
  originalLink?: string;
  category?: string;
  hot?: boolean;
};
export function Article(props: ArticlePropType) {
  const t = useTranslations("Article");
  const [viewDetails, setViewDetails] = useState(false);
  const currentUserIsOperator = sessionStorage.getItem("insights_user_r") === "op";

  const [isDeleted, setIsDeleted] = useState(false);
  const [btnDeleteLoading, setBtnDeleteLoading] = useState(false);

  const handleDeleteNews = (id: string) => {
    if (window.confirm(t("ConfirmDelete"))) {
      setBtnDeleteLoading(true);
      deleteItem(id, "news")
        .then(() => {
          toast.success(t("DeleteSuccess"), toastConfig);
          setIsDeleted(true);
        })
        .catch((e) => {
          toast.error(t("DeleteFailure"), toastConfig);
        })
        .finally(() => {
          setBtnDeleteLoading(false);
        });
    }
  };

  return (
    !isDeleted && (
      <div className="article-item" key={props.id}>
        <div className="flex flex-row w-full gap-x-8">
          <div className="flex w-full flex-col gap-y-3">
            <Link href={props.originalLink || "#"} target="_blank" className="article-title">
              {props.title || "Null"}
            </Link>
            <Link href={props.sourceLink || "#"} target="_blank" className="badge">
              {props.source || "anonymous"}
            </Link>
            <img
              src={props.thumbnail ? "https://images.weserv.nl/?url=" + props.thumbnail : "/news/default2.jpg"}
              alt={props.title || ""}
              className="article-img"
            />
            {viewDetails ? (
              <div className="article-content">{parse(props.content || "")}</div>
            ) : (
              <div className="article-content">{parse(props.subject || "")}</div>
            )}
            <div className="article-more">
              <span onClick={() => setViewDetails(!viewDetails)} className="more-btn">
                <span>{t("ViewMore")} </span>
                <img src={!viewDetails ? "/down.svg" : "/up.svg"} alt="" className="inline" />
              </span>
              <span className="more-date text-nowrap">
                {props.sourceCreateTime ? dateFormat(props.sourceCreateTime) : new Date().toLocaleString()}
              </span>
            </div>
          </div>
          <div className="article-img-content">
            {/*fix cdn image load error: https://images.weserv.nl/*/}
            <img
              src={props.thumbnail ? "https://images.weserv.nl/?url=" + props.thumbnail : "/news/default2.jpg"}
              alt={props.title || ""}
            />
            {currentUserIsOperator && (
              <button
                className="btn btn-warning btn-sm font-bold w-36 mt-5"
                disabled={btnDeleteLoading}
                onClick={() => handleDeleteNews(props.id)}
              >
                {t("Delete")}
                {btnDeleteLoading && <span className="loading loading-spinner loading-xs"></span>}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
}
