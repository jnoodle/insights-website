import numeral from "numeral";
import { formatEther, formatUnits } from "viem";

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

export const pageSize = 10;
