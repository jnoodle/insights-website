import { toast } from "react-toastify";
import { dateFormat, toastConfig } from "@/app/utils";
import axios from "axios";
import { CmcCoinInfo, DexCoinInfo } from "@/components/Prediction";
import { CoinValue } from "@/components/AddPrediction";
import { XMLParser } from "fast-xml-parser";
import { TokenLabel } from "@/components/TokenLabel";

export const getCoins = async (keyword: string, t?: any): Promise<CoinValue[]> => {
  if (keyword && keyword.length > 1) {
    // return axios.get(`/v0/public/coins?keyword=${keyword}&from=0&size=50`).then((res) =>
    //   res.data.data.map((c: CoinInfo) => ({
    //     label: `${c.symbol} (${c.name}) (${c.slug})`,
    //     value: c.id + "",
    //   })),
    // );
    return axios.get(`https://api.dexscreener.com/latest/dex/search/?q=${keyword}`).then((res) => {
      let pairs;
      if (res && res.data && res.data.pairs && res.data.pairs.length > 0)
        pairs = res.data.pairs.map((c: DexCoinInfo) => ({
          // option format
          label: TokenLabel(c, t),
          // option value
          value: JSON.stringify({
            chainId: c.chainId,
            address: c.baseToken.address,
            symbol: c.baseToken.symbol,
            name: c.baseToken.name,
            url: c.url,
            price: c.priceUsd,
            dexId: c.dexId,
            pairAddress: c.pairAddress,
            labels: c.labels ? Array.from(c.labels).join(",") : "",
            dexscreenerPair: JSON.stringify(c),
          }),
        }));
      // console.log("pairs", pairs);
      return pairs;
    });
  } else {
    return [];
  }
};

export const getTopTopics = async (lang: string) => {
  return (
    axios
      // .get(`/buzz/rss`)
      .get(`/v0/public/chainbuzz?from=0&size=100&lang=${lang}`)
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
          const summaryArr = res.data.data ? (res.data.data.length === 1 ? res.data.data[0] : res.data.data) : [];
          return (
            summaryArr
              .map((e: any) => {
                try {
                  // const summaryObj = parser.parse(e.summary);
                  // console.log("summaryObj", summaryObj);
                  // if (summaryObj.span) {
                  //   return {
                  //     title: e.title,
                  //     updated: dateFormat(e.updated),
                  //     summary: e.summary,
                  //     // mentions: +summaryObj.span?.mention || 0,
                  //     source: summaryObj.link || "#",
                  //   };
                  // } else {
                  return {
                    title: e.title,
                    updated: dateFormat(e.updated),
                    summary: e.summary,
                    // mentions: +summaryObj.p?.span?.mention || 0,
                    source: e.link || "#",
                  };
                  // }
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

export const getTopPredictions = async () => {
  return axios.get(`/v0/public/prediction/ranking`).then((res) => {
    if (res && res.data && res.data.code === 0) {
      return res.data.data.slice(0, 10);
    } else {
      return [];
    }
  });
};
