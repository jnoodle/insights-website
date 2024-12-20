import numeral from "numeral";
import { formatEther, formatUnits } from "viem";
import { Slide } from "react-toastify";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { clearStorage } from "@/components/ConnectButton";

export function ellipseAddress(address = "", width = 4): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export const bigIntMax = (...args: any[]) => args.reduce((m, e) => (e > m ? e : m));
export const bigintMin = (...args: any[]) => args.reduce((m, e) => (e < m ? e : m));

// convert date to local date
export const dateFormat = (date: string) => {
  // const d = new Date(date);
  // const utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  // return utc.toLocaleString();
  return dayjs(date.replace("T", " ")).format("DD/MM HH:mm");
};

// remove emoji
export const filterString = (text: string) => {
  return text
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    )
    .trim();
};

export const isLogin = async () => {
  try {
    if (
      localStorage.getItem("insights_token_timeout") &&
      Math.ceil(+new Date() / 1000) - +(localStorage.getItem("insights_token_timeout") || 0) > 0
    ) {
      console.error("Token timeout");
      clearStorage();
      return false;
    }
    if (
      localStorage.getItem("insights_address") &&
      localStorage.getItem("insights_token") &&
      localStorage.getItem("insights_signin_message") &&
      localStorage.getItem("insights_signin_signature")
    ) {
      // is login correct
      const message = JSON.parse(localStorage.getItem("insights_signin_message") || "");
      const signature = localStorage.getItem("insights_signin_signature");
      console.log(message);
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) {
        console.error("Error verifying message");
        clearStorage();
        return false;
      }

      console.log(localStorage.getItem("insights_address") + " already Login");

      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    clearStorage();
    return false;
  }
};

export const formatPrice = (price: number | string | undefined | null) => {
  if (!price) {
    return "-";
  } else if (+price < 0.1) {
    // fix low price
    const priceStr = Number(price).toFixed(100);
    const arr = priceStr.split(".")[1];
    const zeros = arr.length - arr.replace(/0+/, "").length;
    return priceStr.substring(0, zeros + 6);
  } else if (+price < 100) {
    return numeral(price).format("0.000");
  } else {
    return numeral(price).format("0.00");
  }
};

// ROI abs
export const ROI = (source: string | number | undefined | null, target: string | number | undefined | null) => {
  if (source && target) {
    const _source = new BigNumber(source);
    const _target = new BigNumber(target);
    return _target.minus(_source).multipliedBy(100).dividedBy(_source).abs().toPrecision(2);
  }
  return "";
};

export const pageSize = 30;

export const toastConfig: any = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};

export const hexEncode = (str: string) => {
  let hex, i;
  let result = "";
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }
  return result;
};
export const hexDecode = (str: string) => {
  let j;
  const hexes = str.match(/.{1,4}/g) || [];
  let back = "";
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }
  return back;
};
