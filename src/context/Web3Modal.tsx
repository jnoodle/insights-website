"use client";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { cookieStorage, createStorage, State, WagmiProvider } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chain } from "viem/chains";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { confluxEspaceMainnet, confluxEspaceTestnet } from "@/context/Blockchains";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
// TODO
const projectId: string = "3cf86835898ef3b1ab600f3166f8a3ec";

// 2. Create wagmiConfig
const metadata: any = {
  name: "Insights",
  description: "",
  url: "https://web3insights.news",
  icons: ["https://web3insights.news/favicon.png"],
};

const chains: [Chain, ...Chain[]] = [mainnet, confluxEspaceMainnet, confluxEspaceTestnet];
const wagmiConfig = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});

// 3. Create modal
const modal = createWeb3Modal({
  wagmiConfig,
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66",
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
    "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
  ],
  enableAnalytics: true,
  // customWallets: [
  //   {
  //     id: "myCustomWallet",
  //     name: "My Custom Wallet",
  //     homepage: "www.mycustomwallet.com", // Optional
  //     image_url: "my_custom_wallet_image", // Optional
  //     mobile_link: "mobile_link", // Optional - Deeplink or universal
  //     desktop_link: "desktop_link", // Optional - Deeplink
  //     webapp_link: "webapp_link", // Optional
  //     app_store: "app_store", // Optional
  //     play_store: "play_store", // Optional
  //   },
  // ],
  projectId,
  defaultChain: mainnet,
});

modal.setThemeMode("light"); // dark
modal.setThemeVariables({
  "--w3m-font-family": '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  "--w3m-accent": "#FCFC03",
});

export function Web3Modal({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
