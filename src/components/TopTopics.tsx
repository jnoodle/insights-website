import React, { useEffect, useRef, useState } from "react";
import { getTopTopics } from "@/api/public";
import { useTranslations } from "next-intl";

export type TopTopicType = {
  title?: string;
  updated?: string;
  summary?: string;
  source?: string;
  mentions?: string | number;
};

export const TopTopics = () => {
  const t = useTranslations("TopTopic");
  const [topics, setTopics] = useState<TopTopicType[]>([]);
  const [isTopTopicsLoading, setIsTopTopicsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    if (!effectRef.current) {
      getTopics();
    }
    return () => (effectRef.current = true);
  }, []);
  const getTopics = () => {
    if (isTopTopicsLoading) return;
    setIsTopTopicsLoading(true);
    getTopTopics()
      .then((res) => {
        if (res && res.length > 0) {
          setTopics(res);
        }
      })
      .finally(() => {
        setIsTopTopicsLoading(false);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center w-full my-2 py-4 px-4 border rounded-lg border-secondary">
      <h1 className="text-accent font-bold text-lg border-b  border-secondary w-full text-center pb-2">{t("Title")}</h1>
      {isTopTopicsLoading && <span className="loading loading-dots loading-sm mt-2"></span>}
      <ol className="text-left w-full list-decimal pl-6 text-neutral text-sm mt-2">
        {topics.map((topic, i) => (
          <li key={i} className="p-2 hover:bg-base-200">
            <details className="collapse rounded-none outline-0 text-accent">
              <summary className="collapse-title font-bold text-base p-0 min-h-0 link">{topic.title}</summary>
              <div className="collapse-content">
                {topic.summary}{" "}
                <a href={topic.source} target="_blank">
                  {t("ViewOriginal")}
                </a>
              </div>
            </details>
            <span className="text-xs">
              {topic.updated}&nbsp;&nbsp;&nbsp;{topic.mentions} {t("mentions")}
            </span>
          </li>
        ))}
      </ol>
      {/*<table className="table table-sm">*/}
      {/*  <thead>*/}
      {/*    <tr>*/}
      {/*      <th className="hidden md:table-cell"></th>*/}
      {/*      <th>Topic</th>*/}
      {/*      <th className="text-right">Mention</th>*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*  <tbody>*/}
      {/*    {topics.map((t, i) => (*/}
      {/*      <tr key={i}>*/}
      {/*        <th className="text-neutral hidden md:table-cell">{i + 1}</th>*/}
      {/*        <td>*/}
      {/*          <details className="collapse rounded-none outline-0">*/}
      {/*            <summary className="collapse-title font-bold text-sm p-0 min-h-0">{t.title}</summary>*/}
      {/*            <div className="collapse-content">*/}
      {/*              {t.summary}{" "}*/}
      {/*              <a href={t.source} target="_blank">*/}
      {/*                查看原文*/}
      {/*              </a>*/}
      {/*            </div>*/}
      {/*          </details>*/}
      {/*        </td>*/}
      {/*        <td className="text-right">{t.mentions}</td>*/}
      {/*      </tr>*/}
      {/*    ))}*/}
      {/*  </tbody>*/}
      {/*</table>*/}
    </div>
  );
};
