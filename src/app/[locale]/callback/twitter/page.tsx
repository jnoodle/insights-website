"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { bindTwitterWithUser } from "@/api/user";
import { toast } from "react-toastify";
import { toastConfig } from "@/app/utils";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Pages");
  const effectRef = useRef(false);

  useEffect((): any => {
    if (!effectRef.current) {
      if (searchParams) {
        // bind twitter step 2: get callback params: oauth_token, oauth_verifier
        const oauth_token = searchParams.get("oauth_token");
        const oauth_verifier = searchParams.get("oauth_verifier");
        // console.log(oauth_token);
        // console.log(oauth_verifier);
        if (oauth_token && oauth_verifier) {
          // bind twitter step 3: use oauth_token and oauth_verifier to get twitter id and bind
          bindTwitterWithUser(oauth_token, oauth_verifier)
            .then((res) => {
              if (res) {
                toast.success(t("BindTwitterSuccess"), toastConfig);
                // bind twitter step 4: redirect to profile page
                router.push("/profile");
              } else {
                toast.error(t("GetBindTwitterUriError"), toastConfig);
              }
            })
            .catch(() => {
              toast.error(t("GetBindTwitterUriError"), toastConfig);
            });
        }
      }
    }
    return () => (effectRef.current = true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between w-full pt-14">
      <h1>
        <span className="loading loading-spinner loading-xs mr-2"></span>
        {t("BindTwitterLoading")}
      </h1>
    </div>
  );
}
