import { defineChain } from "viem";

export const pepeUnchainedMainnet = defineChain({
  id: 3409,
  name: "Pepe Unchained Mainnet",
  network: "pepe-unchained",
  nativeCurrency: {
    name: "Pepe Unchained",
    symbol: "PEPU",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Pepscan",
      url: "https://pepuscan.com",
    },
  },
});
