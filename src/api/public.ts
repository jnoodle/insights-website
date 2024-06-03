import { toast } from "react-toastify";
import { dateFormat, toastConfig } from "@/app/utils";
import axios from "axios";
import { CmcCoinInfo, DexCoinInfo } from "@/components/Prediction";
import { CoinValue } from "@/app/profile/page";
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import { TopTopicType } from "@/components/TopTopics";

export const getCoins = async (keyword: string): Promise<CoinValue[]> => {
  if (keyword && keyword.length > 1) {
    // return axios.get(`/v0/public/coins?keyword=${keyword}&from=0&size=50`).then((res) =>
    //   res.data.data.map((c: CoinInfo) => ({
    //     label: `${c.symbol} (${c.name}) (${c.slug})`,
    //     value: c.id + "",
    //   })),
    // );
    return axios.get(`https://api.dexscreener.com/latest/dex/search/?q=${keyword}`).then((res) => {
      if (res && res.data && res.data.pairs && res.data.pairs.length > 0)
        return res.data.pairs.map((c: DexCoinInfo) => ({
          label: `${c.baseToken.symbol} (price: ${c.priceUsd}) (${c.baseToken.name}) (${c.chainId}: ${c.baseToken.address})`,
          value: JSON.stringify({
            chainId: c.chainId,
            address: c.baseToken.address,
            symbol: c.baseToken.symbol,
            name: c.baseToken.name,
            url: c.url,
            price: c.priceUsd,
          }),
        }));
    });
  } else {
    return [];
  }
};

export const getTopTopics = async () => {
  return (
    axios
      // .get(`/buzz/rss`)
      .get(`/v0/public/chainbuzz?from=0&size=100`)
      // .then((res) => res.data)
      // .then((text) => {
      //   const parser = new XMLParser();
      //   let entries = parser.parse(text).feed.entry;
      //   // console.log(entries);
      //   return entries
      //     .map((e: any) => {
      //       const summaryObj = parser.parse(e.summary);
      //       // console.log(summaryObj);
      //       return {
      //         title: e.title,
      //         updated: dayjs(e.updated).format("MM-DD HH:mm:ss"),
      //         summary: summaryObj.p[0],
      //         mentions: +summaryObj.span.mention,
      //         source: summaryObj.p[1].div[0].a,
      //       };
      //     })
      //     .sort((a: any, b: any) => b.mentions - a.mentions)
      //     .slice(0, 10);
      // })
      .then((res) => {
        if (res && res.data && res.data.code === 0) {
          const parser = new XMLParser({
            ignoreAttributes: false,
          });
          return (
            res.data.data
              .map((e: any) => {
                const summaryObj = parser.parse(e.summary);
                console.log("summaryObj", summaryObj);
                try {
                  if (summaryObj.span) {
                    return {
                      title: e.title,
                      updated: dateFormat(e.updated),
                      summary: summaryObj.p[0] || e.title,
                      mentions: +summaryObj.span?.mention || 0,
                      source: summaryObj.div?.a["@_href"] || "#",
                    };
                  } else {
                    return {
                      title: e.title,
                      updated: dateFormat(e.updated),
                      summary: summaryObj.p?.p[0] || e.title,
                      mentions: +summaryObj.p?.span?.mention || 0,
                      source: summaryObj.p?.div?.a["@_href"] || "#",
                    };
                  }
                } catch (e) {
                  console.error(e);
                  return null;
                }
              })
              // .sort((a: any, b: any) => b.mentions - a.mentions)
              .filter((a: any) => a !== null)
              .slice(0, 10)
          );
        } else {
          return [];
        }
      })
  );
};
