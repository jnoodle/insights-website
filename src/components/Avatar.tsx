import parse from "html-react-parser";
import multiavatar from "@multiavatar/multiavatar";
import { filterString, hexEncode } from "@/app/utils";
import * as React from "react";
import { InsightsUser } from "@/components/Tweet";
import { useTranslations } from "next-intl";

export type AvatarPropType = {
  className?: string;
  user?: InsightsUser;
};
export function Avatar({ className, user, ...props }: AvatarPropType) {
  return (
    <div className="avatar">
      <div className={className || "w-12 rounded-full"}>
        <img
          src={
            user && user.alias
              ? `/avatars/avatar_alpha_${+(BigInt("0x" + hexEncode(user!.alias)) % BigInt("128")).toString(10) + 1}.png`
              : "/insights-logo-icon.svg"
          }
          alt={user ? user.name || user.alias : ""}
          onError={(e) => (e.currentTarget.src = "/insights-logo-icon.svg")}
        />
      </div>
    </div>
  );
}
