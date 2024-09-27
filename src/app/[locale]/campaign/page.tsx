"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

export default function Home() {
  const t = useTranslations("Ad");
  const [points, setPoints]: [any[], any] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const effectRef = useRef(false);

  useEffect((): any => {
    // fix react 18 strict mode: https://rishabhsharma.bio/next-js-issue-useeffect-hook-running-twice-in-client-9fb6712f6362
    if (!effectRef.current) {
      fetchMoreData();
    }
    return () => (effectRef.current = true);
  }, []);

  const fetchMoreData = () => {
    if (isLoading) return;

    setIsLoading(true);
    axios
      .get(`/v0/public/top/credit`)
      .then((res) => {
        if (res.data && res.data.code === 0 && res.data.data.length > 0) {
          setPoints(res.data.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-between w-full pt-4">
      <AdBanner />
      <div className="card bg-slate-50 shadow-xl w-full">
        <div className="card-body px-4 md:px-8">
          <h2 className="card-title justify-center w-full">{t("CampaignName")}</h2>
          <div className="w-full text-left md:p-4 leading-normal">
            <p>
              {t("CampaignDate")}: {t("CampaignDateDetail")}
            </p>
            <p>{t("CampaignRules")}: </p>
            <div dangerouslySetInnerHTML={{ __html: t.raw("CampaignRulesDetail") }} />
          </div>
          <div className="card-actions justify-end">
            <Link href="/profile" className="btn btn-primary md:btn-lg text-white">
              {t("CampaignJoin")}
            </Link>
          </div>
        </div>
      </div>
      <div className="card bg-slate-100 shadow-xl w-full mt-6">
        <div className="card-body px-4 md:px-8">
          <h2 className="card-title justify-center w-full">{t("PointsRanking")}</h2>
          <div className="w-full text-left md:p-4 leading-normal">
            {isLoading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>{t("PointsRankingUser")}</th>
                    <th className="text-right">{t("PointsRankingPoint")}</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((t, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex flex-col">
                          <Link href={"/user/" + t.alias} className="link md:text-base font-bold">
                            {t.name ? t.name : t("Anonymous")}
                          </Link>
                          <span className="font-normal text-xs md:ml-2 md:text-sm">
                            @{t.alias ? t.alias : t("Anonymous")}
                            &nbsp;{t.address ? t.address : ""}
                          </span>
                        </div>
                      </td>
                      <td className="text-base font-bold text-right">{t.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
