import React, { useEffect, useRef, useState } from "react";
import { getTopTopics } from "@/api/public";
import { useLocale, useTranslations } from "next-intl";

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
  const locale = useLocale();

  useEffect((): any => {
    if (!effectRef.current) {
      getTopics();
    }
    return () => (effectRef.current = true);
  }, []);
  const getTopics = () => {
    if (isTopTopicsLoading) return;
    setIsTopTopicsLoading(true);
    getTopTopics(locale.indexOf("zh") > -1 ? "zh-cn" : "en")
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
    <div className="ranking-news ranking flex flex-col items-center justify-center w-full">
      <h1 className="text-accent w-full pb-2">
        <i></i>
        {t("Title")}
        <i></i>
      </h1>
      {isTopTopicsLoading && <span className="loading loading-dots loading-sm mt-4"></span>}
      <ol className="ranking-news-list">
        {topics.map((topic, i) => (
          <li key={i}>
            <details className="collapse rounded-none outline-0 text-accent">
              <summary className="collapse-title">
                <div className=" flex flex-row">
                  <span className={`topic-number number-${i + 1}`}>{i + 1}</span>
                  <span className={`topic-title number-${i + 1}`}>
                    {topic.title}
                    {i < 3 && <img alt="hot" src="/news/hot.svg" className="lg:hidden" />}
                  </span>
                </div>
              </summary>
              <div className="collapse-content">
                {topic.summary}
                <div className="mt-2">
                  <a href={topic.source} target="_blank" className="link">
                    {t("ViewOriginal")}
                  </a>
                </div>
              </div>
            </details>
            {/*<span className="text-xs">*/}
            {/*  {topic.updated}&nbsp;&nbsp;&nbsp;{topic.mentions} {t("mentions")}*/}
            {/*</span>*/}
          </li>
        ))}
      </ol>
    </div>
  );
};
