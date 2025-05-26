// src/providers/WalletProvider.tsx
"use client";
import { http } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
// import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const pepe = {
  id: 3409,
  name: "Pepe Unchained Mainnet",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
  iconBackground: "#fff",
  nativeCurrency: { name: "PEPE", symbol: "PEPU", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        "https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz/BJt1x3Xz1cE33JvBRUhdht5sbPrfbf6Gb",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "PEP",
      url: "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz",
    },
  },
};

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [pepe],
  transports: {
    [pepe.id]: http(
      "https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz/BJt1x3Xz1cE33JvBRUhdht5sbPrfbf6Gb"
    ),
  },
});
// const config = getDefaultConfig({
//   appName: "MatrixFrog",
//   projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
//   chains: [mainnet],
//   ssr: true,
// });

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
