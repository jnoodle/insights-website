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
      <div
        className="flex flex-col w-full px-4 pt-3 pb-4 text-sm border-b border-b-secondary hover:bg-base-200"
        key={props.id}
      >
        <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="text-base font-bold">
              <Link href={props.originalLink || "#"} target="_blank" className="text-accent link">
                {props.title || "Null"}
              </Link>
            </div>
          </div>
          <div className="date whitespace-nowrap mt-1 md:mt-0">
            <div className="badge mr-3 border-secondary bg-secondary hover:bg-primary">
              <Link href={props.sourceLink || "#"} target="_blank" className="text-neutral hover:text-white">
                {props.source || "anonymous"}
              </Link>
            </div>
            <span className="text-nowrap text-neutral">
              {props.sourceCreateTime ? dateFormat(props.sourceCreateTime) : new Date().toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center mt-2">
          {props.thumbnail && (
            <div className="thumbnail mr-3">
              <div className="w-32 h-16 bg-neutral">
                {/*fix cdn image load error: https://images.weserv.nl/*/}
                <img
                  src={"https://images.weserv.nl/?url=" + props.thumbnail || "/blockchaindemo.jpg"}
                  alt={props.title || ""}
                  style={{ width: "8rem", height: "4rem", objectFit: "cover" }}
                />
              </div>
            </div>
          )}
          <div className="flex text-sm items-start justify-between w-full flex-col text-neutral">
            {viewDetails ? (
              parse(props.content || "")
            ) : (
              <div>
                {parse(props.subject || "")}
                <span
                  className="text-primary ml-2 cursor-pointer text-left inline"
                  onClick={() => setViewDetails(true)}
                >
                  <span>{t("ViewMore")} </span>
                  <img src="/downArrow.svg" alt="" className="inline w-5" />
                </span>
              </div>
            )}
          </div>
          {currentUserIsOperator && (
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <button
                className="btn btn-warning btn-xs font-normal"
                disabled={btnDeleteLoading}
                onClick={() => handleDeleteNews(props.id)}
              >
                {t("Delete")}
                {btnDeleteLoading && <span className="loading loading-spinner loading-xs"></span>}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}
