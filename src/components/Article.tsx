"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { utcLocal } from "@/app/utils";
import parse from "html-react-parser";

export type ArticlePropType = {
  id?: string;
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
  const [viewDetails, setViewDetails] = useState(false);
  return (
    <div className="flex flex-col w-full px-2 pt-3 pb-4 text-sm border-b border-b-secondary" key={props.id}>
      <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
          <div className="text-base font-bold">
            <Link href={props.originalLink || "#"} target="_blank" className="link text-accent">
              {props.title || "Mfer创始人Sartoshi在Base链发行mfercoin"}
            </Link>
          </div>
        </div>
        <div className="date">
          <Link href={props.sourceLink || "#"} target="_blank" className="text-primary mr-3">
            {props.source || "anonymous"}
          </Link>
          <span className="text-nowrap">
            {props.sourceCreateTime ? utcLocal(props.sourceCreateTime) : new Date().toLocaleString()}
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
        <div className="flex text-sm">
          {viewDetails ? (
            parse(props.content || "")
          ) : (
            <>
              {parse(props.subject || "")}
              <span className="text-primary ml-2 flex cursor-pointer" onClick={() => setViewDetails(true)}>
                more <Image src="/downArrow.svg" alt="" width={20} height={14} priority className="inline" />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
