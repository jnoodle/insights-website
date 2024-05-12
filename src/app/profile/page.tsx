"use client";

import React, { useEffect, useState } from "react";
import { ProfileTab } from "@/components/ProfileTab";
import { ellipseAddress } from "@/app/utils";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { getMyProfile } from "@/api/user";
import multiavatar from "@multiavatar/multiavatar/esm";
import parse from "html-react-parser";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [alias, setAlias] = useState("test");
  const [name, setName] = useState("Insights_abcd");

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between w-full pt-14">
      {!isConnected && (
        <div role="alert" className="alert alert-warning">
          <span>Please connect wallet!</span>
        </div>
      )}
      {isConnected && (
        <div className="flex items-center gap-4 w-full">
          <div className="avatar">
            <div className="w-32 rounded-full">{parse(multiavatar(name || "Anonymous"))}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-accent">{name}</div>
            <div className="">@{alias}</div>
            <div className="">
              Address:{" "}
              <span className="text-primary cursor-pointer" onClick={() => open({ view: "Account" })}>
                {ellipseAddress(address)}
              </span>
            </div>
            <div className="">
              Twitter:{" "}
              <Link href={"#"} className="text-primary">
                Name @name
              </Link>
            </div>
          </div>
        </div>
      )}
      {isConnected && (
        <div className="flex items-center w-full mt-6">
          <ProfileTab alias={alias} />
        </div>
      )}
    </div>
  );
}
