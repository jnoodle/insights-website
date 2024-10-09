import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const AdBanner = () => {
  const t = useTranslations("Loading");
  return null;
  // return (
  //   <div className="flex items-center justify-center w-full py-2">
  //     <Link href="/campaign">
  //       <img src="/banner-m.jpg" alt="Point Reward Campaign" className="block md:hidden" />
  //       <img src="/banner.jpg" alt="Point Reward Campaign" className="hidden md:block" />
  //     </Link>
  //   </div>
  // );
};
