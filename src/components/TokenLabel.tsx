import { DexCoinInfo } from "@/components/Prediction";
import React from "react";
import { ellipseAddress } from "@/app/utils";

export const TokenLabel: (t: DexCoinInfo) => React.JSX.Element = (t: DexCoinInfo) => {
  // `${c.baseToken.symbol} (price: ${c.priceUsd}) (${c.baseToken.name}) (${c.chainId}: ${c.baseToken.address})`,
  return (
    <div className="text-sm">
      <div>
        <span className="font-bold">{t.baseToken.symbol}</span> ({t.baseToken.name})
      </div>
      <div>
        <span className="font-bold">${t.priceUsd}</span> 24H Price Change:{" "}
        <span className={`${t.priceChange.h24 >= 0 ? "text-success" : "text-error"}`}>{t.priceChange.h24}%</span>
        <span className="badge border-0 bg-sky-200 ml-2">
          {t.dexId} {t.labels}
        </span>
      </div>
      <div>
        <span className="">
          {t.chainId}: {t.baseToken.address}
        </span>
      </div>
      <div>
        <span className="text-neutral text-xs">
          {t.baseToken.symbol}/{t.quoteToken.symbol} Pair: {ellipseAddress(t.pairAddress)}
        </span>
      </div>
    </div>
  );
};

export const TokenDropdownRender = (menu: any) => (
  <>
    {menu}
    <div className="border-t border-secondary py-2 px-4 text-xs italic text-neutral">
      <span>Symbol (Name)</span>
      <span className="not-italic"> | </span>
      <span>Price Usd, 24H Price Change, Dex</span>
      <span className="not-italic"> | </span>
      <span>Chain: Contract Address</span>
      <span className="not-italic"> | </span>
      <span>Pair: Pair Address</span>
    </div>
  </>
);
