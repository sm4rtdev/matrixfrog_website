// app/client.ts
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// PEPU Chain Definition
export const pepuChain = defineChain({
  // id: 3409,
  // rpc: "https://3409.rpc.thirdweb.com",
  // name: "Pepe Unchained",
  // nativeCurrency: {
  //   name: "Pepe Unchained",
  //   symbol: "PEPU",
  //   decimals: 18,
  // }
  id: 97741,
  rpc: "rpc-pepu-v2-mainnet-0.t.conduit.xyz",
  name: "Pepe Unchained Mainnet",
  nativeCurrency: {
    name: "Pepe Unchained Mainnet",
    symbol: "PEPU",
    decimals: 18,
  },
});

// Supported Chain Configuration
export const supportedChains = {
  pepu: {
    chain: pepuChain,
    name: "PEPU",
    fullName: "Pepe Unchained L2",
    icon: "🐸",
    type: "L2",
  },
} as const;

// ThirdWeb Client
export const client = createThirdwebClient({
  clientId: "eb1a013ccae0d56d106e20af75e92a8d",
});

// Helper function to check if we're on PEPU chain
export const isPepuChain = (chainId: number): boolean => {
  return chainId === pepuChain.id;
};
