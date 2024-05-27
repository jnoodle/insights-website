import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";
import axios from "axios";
import { CoinInfo } from "@/components/Prediction";
import { CoinValue } from "@/app/profile/page";
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import { TopTopicType } from "@/components/TopTopics";

export const getCoins = async (keyword: string): Promise<CoinValue[]> => {
  return axios.get(`/v0/public/coins?keyword=${keyword}&from=0&size=10`).then((res) =>
    res.data.data.map((c: CoinInfo) => ({
      label: `${c.symbol} (${c.name})`,
      value: c.id + "",
    })),
  );
};

export const getTopTopics = async () => {
  return axios
    .get(`/buzz/rss`)
    .then((res) => res.data)
    .then((text) => {
      const parser = new XMLParser();
      let entries = parser.parse(text).feed.entry;
      console.log(entries);
      return entries
        .map((e: any) => {
          const summaryObj = parser.parse(e.summary);
          console.log(summaryObj);
          return {
            title: e.title,
            updated: dayjs(e.updated).format("MM-DD HH:mm:ss"),
            summary: summaryObj.p[0],
            mentions: +summaryObj.span.mention,
            source: summaryObj.p[1].div[0].a,
          };
        })
        .sort((a: any, b: any) => b.mentions - a.mentions)
        .slice(0, 10);
    });
};
