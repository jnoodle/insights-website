import { DexCoinInfo } from "@/components/Prediction";
import React from "react";
import { ellipseAddress } from "@/app/utils";
import { useTranslations } from "next-intl";

export const TokenLabel: (token: DexCoinInfo, t?: any) => React.JSX.Element = (token: DexCoinInfo, t) => {
  // `${c.baseToken.symbol} (price: ${c.priceUsd}) (${c.baseToken.name}) (${c.chainId}: ${c.baseToken.address})`,
  return (
    <div className="text-sm">
      <div>
        <span className="font-bold">{token.baseToken.symbol}</span> ({token.baseToken.name})
      </div>
      <div>
        <span className="font-bold">${token.priceUsd}</span> {t("24HChange")}{" "}
        <span className={`${token.priceChange.h24 >= 0 ? "text-success" : "text-error"}`}>
          {token.priceChange.h24}%
        </span>
        <span className="badge border-0 bg-sky-200 ml-2">
          {token.dexId} {token.labels}
        </span>
      </div>
      <div>
        <span className="">
          {token.chainId}: {token.baseToken.address}
        </span>
      </div>
      <div>
        <span className="text-neutral text-xs">
          {token.baseToken.symbol}/{token.quoteToken.symbol} Pair: {ellipseAddress(token.pairAddress)}
        </span>
      </div>
    </div>
  );
};

export const TokenDropdownRender = (menu: any) => {
  const t = useTranslations("TokenDropdownRender");
  return (
    <>
      {menu}
      <div className="border-t border-secondary py-2 px-4 text-xs italic text-neutral">
        <span>{t("Section1")}</span>
        <span className="not-italic"> | </span>
        <span>{t("Section2")}</span>
        <span className="not-italic"> | </span>
        <span>{t("Section3")}</span>
        <span className="not-italic"> | </span>
        <span>{t("Section4")}</span>
      </div>
    </>
  );
};
