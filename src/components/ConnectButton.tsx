"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  useAccount,
  useSignTypedData,
  useSwitchChain,
  useAccountEffect,
  useDisconnect,
  useSignMessage,
  useSwitchAccount,
} from "wagmi";
import { ellipseAddress, toastConfig } from "@/app/utils";
import { SiweMessage } from "siwe";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getMyProfile, getUserProfile, Login } from "@/api/user";
import Image from "next/image";
import * as React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const clearStorage = () => {
  localStorage.removeItem("insights_signin_message");
  localStorage.removeItem("insights_signin_signature");
  localStorage.removeItem("insights_address");
  localStorage.removeItem("insights_token");
  localStorage.removeItem("insights_token_timeout");
  localStorage.removeItem("insights_user");
  localStorage.removeItem("insights_user_alias");
  sessionStorage.removeItem("insights_user_r");
};

export default function ConnectButton() {
  const t = useTranslations("ConnectButton");
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, chainId, isConnecting, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { chains, switchChain } = useSwitchChain();
  const [isSigning, setIsSigning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // change address
  const [preAddress, setPreAddress] = useState("");
  const handleConnect = () => {
    console.log("handleConnect", address);
    if (!address && !isSigning) {
      // connect wallet
      open();
      // } else if (chainId !== +process.env.NEXT_PUBLIC_CorrectChainId!) {
      //   // switch chain
      //   switchChain({ chainId: +process.env.NEXT_PUBLIC_CorrectChainId! });
    }
    // else {
    //   // goto profile page
    //   router.push("/profile");
    //   // open({ view: "Account" });
    // }
  };
  const handleDisconnect = () => {
    disconnect();
    clearStorage();
    window.location.reload();
    const elem = document.activeElement;
    if (elem) {
      // @ts-ignore
      elem?.blur();
    }
  };
  const handleToProfile = (e: any, tab: string | undefined) => {
    e.preventDefault();
    router.push("/profile" + (tab ? "?t=" + tab : ""));
    router.refresh(); //TODO
    const elem = document.activeElement;
    if (elem) {
      // @ts-ignore
      elem?.blur();
    }
  };

  // TODO address change
  useAccountEffect({
    // sign-in with wallet after connect
    onConnect(data) {
      console.log("onConnect", data);
      const { address, chainId } = data;
      addressConnect(address, chainId);
    },
    onDisconnect() {
      clearStorage();
    },
  });

  useEffect(() => {
    if (preAddress && address && chainId && address !== preAddress) {
      console.log("address change", preAddress, address, chainId);
      setPreAddress(address);
      clearStorage();
      addressConnect(address, chainId);
    }
  }, [address]);

  const addressConnect = async (address: string, chainId: number) => {
    if (!address || !chainId || isLoading) return;
    setIsLoading(true);
    console.log("Connected!", address, chainId);

    // https://1.x.wagmi.sh/examples/sign-in-with-ethereum
    // Sign-In with Ethereum: eip-4361
    try {
      // get address from session, if already signed, do not need to sign in again
      const res = await fetch("/api/me");
      const json = await res.json();
      console.log(json);
      if (address === json.address && localStorage.getItem("insights_signin_message")) {
        console.log("Sign-In-Success with session", json);
        // Login
        await Login(address);
        // get user profile
        await getMyProfile();
        setPreAddress(address);
        setIsLoading(false);
        return;
      }

      setIsSigning(true);
      const nonceRes = await fetch("/api/nonce");
      const nonce = await nonceRes.text();
      if (!address || !chainId) {
        console.error("Wallet connected error!");
        toast.error(t("ConnectError"), toastConfig);
        setIsLoading(false);
        return;
      }

      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to Insights.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      // TODO set referral
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

      console.log("Sign-In-Success", message, signature);
      localStorage.setItem("insights_signin_message", JSON.stringify(message));
      localStorage.setItem("insights_signin_signature", signature);

      // Login
      await Login(address);
      // get user profile
      await getMyProfile();
      setIsSigning(false);
    } catch (error) {
      console.error(error);
      setIsSigning(false);
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end">
        <button
          tabIndex={0}
          className={`btn btn-primary px-4 md:px-6 btn-sm md:btn-md text-sm md:text-base text-white font-normal rounded-full ${
            // isConnected && chainId !== +process.env.NEXT_PUBLIC_CorrectChainId! ? "btn-error" : ""
            isConnected && !chainId ? "btn-error" : ""
          }`}
          // onClick={handleConnect}
        >
          {isSigning ? (
            "Signing In..."
          ) : isConnected ? (
            // chainId === +process.env.NEXT_PUBLIC_CorrectChainId! ? (
            chainId ? (
              isSigning ? (
                t("SigningIn")
              ) : (
                <span className="flex">
                  {ellipseAddress(address)}
                  {/*<Image*/}
                  {/*  src="/profile.svg"*/}
                  {/*  className="ml-1 w-4 md:w-6"*/}
                  {/*  alt={t("MyProfile")}*/}
                  {/*  title={t("MyProfile")}*/}
                  {/*  width={24}*/}
                  {/*  height={24}*/}
                  {/*  priority*/}
                  {/*/>*/}
                </span>
              )
            ) : (
              t("SwitchChain")
            )
          ) : isConnecting ? (
            t("Connecting")
          ) : (
            t("ConnectWallet")
          )}
        </button>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {isConnected && chainId && !isSigning ? (
            <>
              <li>
                <a onClick={(e) => handleToProfile(e, "")}>{t("MyProfile")}</a>
              </li>
              <li>
                <a onClick={(e) => handleToProfile(e, "invitation")}>{t("Invitation")}</a>
              </li>
              <li>
                <a onClick={(e) => handleToProfile(e, "point")}>{t("Points")}</a>
              </li>
              <li>
                <a onClick={handleDisconnect}>{t("Disconnect")}</a>
              </li>
            </>
          ) : (
            <li>
              <a onClick={handleConnect}>
                {isSigning ? (
                  "Signing In..."
                ) : isConnected ? (
                  // chainId === +process.env.NEXT_PUBLIC_CorrectChainId! ? (
                  chainId ? (
                    isSigning ? (
                      t("SigningIn")
                    ) : (
                      <span className="flex">
                        {ellipseAddress(address)}
                        {/*<Image*/}
                        {/*  src="/profile.svg"*/}
                        {/*  className="ml-1 w-4 md:w-6"*/}
                        {/*  alt={t("MyProfile")}*/}
                        {/*  title={t("MyProfile")}*/}
                        {/*  width={24}*/}
                        {/*  height={24}*/}
                        {/*  priority*/}
                        {/*/>*/}
                      </span>
                    )
                  ) : (
                    t("SwitchChain")
                  )
                ) : isConnecting ? (
                  t("Connecting")
                ) : (
                  t("ConnectWallet")
                )}
              </a>
            </li>
          )}
        </ul>
      </div>
      {/*isConnected: {isConnected + ""}*/}
      {/*isSigning: {isSigning + ""}*/}
      {/*isLoading: {isLoading + ""}*/}
      {/*{isConnected + ""}*/}
      {/*<w3m-button />*/}
    </>
  );
}
