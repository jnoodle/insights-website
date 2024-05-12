import numeral from "numeral";
import { formatEther, formatUnits } from "viem";
import { Slide } from "react-toastify";

export function ellipseAddress(address = "", width = 4): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export const bigIntMax = (...args: any[]) => args.reduce((m, e) => (e > m ? e : m));
export const bigintMin = (...args: any[]) => args.reduce((m, e) => (e < m ? e : m));

// convert date to local date
export const utcLocal = (date: string) => {
  // const d = new Date(date);
  // const utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  // return utc.toLocaleString();
  return new Date(date).toLocaleString();
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
        throw new Error("Error verifying message");
      }

      console.log(localStorage.getItem("insights_address") + " already Login");

      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const formatPrice = (price: number | string | undefined) => {
  if (!price) {
    return "-";
  } else if (+price < 0.1) {
    const arr = (price + "").split(".")[1];
    const zeros = arr.length - arr.replace(/0+/, "").length;
    return numeral(price).format("0." + new Array(zeros + 5).join("0"));
  } else if (+price < 100) {
    return numeral(price).format("0.00");
  } else {
    return numeral(price).format("0");
  }
};

export const pageSize = 120;

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
