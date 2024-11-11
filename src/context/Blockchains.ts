import { defineChain } from "viem";

export const blastTestnet = defineChain({
  id: 168587773,
  name: "Blast Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.blast.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blastscan",
      url: "https://testnet.blastscan.io",
    },
  },
  testnet: true,
});

// export const scanUrl = "https://testnet.blastscan.io";
export const scanUrl = "https://testnet-scan.bitlayer.org";

export const confluxEspaceTestnet = defineChain({
  id: 71,
  name: "Conflux eSpace Testnet",
  nativeCurrency: { name: "Conflux", symbol: "CFX", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmtestnet.confluxrpc.com"] },
  },
  blockExplorers: {
    default: {
      name: "Confluxscan",
      url: "https://evmtestnet.confluxscan.io",
    },
  },
  testnet: true,
});

export const confluxEspaceMainnet = defineChain({
  id: 1030,
  name: "Conflux eSpace",
  nativeCurrency: { name: "Conflux", symbol: "CFX", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evm.confluxrpc.com"] },
  },
  blockExplorers: {
    default: {
      name: "Confluxscan",
      url: "https://evm.confluxscan.io",
    },
  },
  testnet: true,
});
export const bitlayerTestnet = defineChain({
  id: 200810,
  name: "Bitlayer Testnet",
  nativeCurrency: { name: "Bitlayer", symbol: "BTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.bitlayer.org"] },
  },
  blockExplorers: {
    default: {
      name: "Bitlayer(BTR) Scan",
      url: "https://testnet-scan.bitlayer.org",
    },
  },
  testnet: true,
});
