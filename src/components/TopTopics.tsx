import React, { useEffect, useRef, useState } from "react";
import { getTopTopics } from "@/api/public";

export type TopTopicType = {
  title?: string;
  updated?: string;
  summary?: string;
  source?: string;
  mentions?: string | number;
};

export const TopTopics = () => {
  const [topics, setTopics] = useState<TopTopicType[]>([]);
  const effectRef = useRef(false);

  useEffect((): any => {
    if (!effectRef.current) {
      getTopics();
    }
    return () => (effectRef.current = true);
  }, []);
  const getTopics = () => {
    getTopTopics().then((res) => {
      if (res && res.length > 0) {
        setTopics(res);
      }
    });
  };
  return (
    <div className="flex flex-col items-center justify-center w-full my-2 py-4 px-2 border rounded-lg bg-gray-50">
      <h1 className="text-accent font-bold">24-Hour Hot Topics</h1>
      <table className="table table-sm">
        <thead>
          <tr>
            <th className="hidden md:table-cell"></th>
            <th>Topic</th>
            <th className="text-right">Mention</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((t, i) => (
            <tr key={i}>
              <th className="text-neutral hidden md:table-cell">{i + 1}</th>
              <td>
                <details className="collapse rounded-none outline-0">
                  <summary className="collapse-title font-bold text-sm p-0 min-h-0">{t.title}</summary>
                  <div className="collapse-content">
                    {t.summary}{" "}
                    <a href={t.source} target="_blank">
                      查看原文
                    </a>
                  </div>
                </details>
              </td>
              <td className="text-right">{t.mentions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
