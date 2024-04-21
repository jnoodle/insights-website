"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSignTypedData, useSwitchChain, useAccountEffect, useDisconnect, useSignMessage } from "wagmi";
import { ellipseAddress } from "@/app/utils";
import { SiweMessage } from "siwe";
import { useState } from "react";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, chainId, isConnecting, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { chains, switchChain } = useSwitchChain();
  const [isSigning, setIsSigning] = useState(false);
  const handleConnect = () => {
    if (!address) {
      open();
    } else if (chainId !== +process.env.NEXT_PUBLIC_CorrectChainId!) {
      switchChain({ chainId: +process.env.NEXT_PUBLIC_CorrectChainId! });
    } else {
      open({ view: "Account" });
    }
  };

  useAccountEffect({
    // sign-in with wallet after connect
    async onConnect(data) {
      console.log("Connected!", data);

      // https://1.x.wagmi.sh/examples/sign-in-with-ethereum
      // Sign-In with Ethereum: eip-4361
      try {
        const { address, chainId } = data;
        // get address from session, if already signed, do not need to sign in again
        const res = await fetch("/api/me");
        const json = await res.json();
        console.log(json);
        if (address === json.address) return;

        setIsSigning(true);
        const nonceRes = await fetch("/api/nonce");
        const nonce = await nonceRes.text();
        if (!address || !chainId) {
          console.error("Wallet connected error!");
          return;
        }

        // Create SIWE message with pre-fetched nonce and sign with wallet
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: "Sign in to Ladder (https://ladder.best).",
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
        setIsSigning(false);
      } catch (error) {
        console.error(error);
        setIsSigning(false);
        disconnect();
      }
    },
  });

  return (
    <>
      <button
        className={`btn btn-primary px-6 btn-sm md:btn-md text-sm md:text-base text-white font-normal rounded-full ${
          isConnected && chainId !== +process.env.NEXT_PUBLIC_CorrectChainId! ? "btn-error" : ""
        }`}
        onClick={handleConnect}
      >
        {isConnected
          ? chainId === +process.env.NEXT_PUBLIC_CorrectChainId!
            ? isSigning
              ? "Signing In..."
              : ellipseAddress(address)
            : "Switch Chain"
          : isConnecting
            ? "Connecting..."
            : "Connect Wallet"}
      </button>
      {/*{isConnected + ""}*/}
      {/*<w3m-button />*/}
    </>
  );
}
