// "use client";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import "@rainbow-me/rainbowkit/styles.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactNode, useState } from "react";
// import { WagmiProvider, createConfig, http } from "wagmi";

// const pepe = {
//   id: 3409,
//   name: "Pepe Unchained Mainnet",
//   iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
//   iconBackground: "#fff",
//   nativeCurrency: { name: "PEPE", symbol: "PEPU", decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: [
//         "https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz/BJt1x3Xz1cE33JvBRUhdht5sbPrfbf6Gb",
//       ],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "PEP",
//       url: "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz",
//     },
//   },
// };

// export const config = createConfig({
//   chains: [pepe],
//   connectors: [], // Optionally specify connectors if needed (e.g., injected(), walletConnect())
//   transports: {
//     [pepe.id]: http(
//       "https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz/BJt1x3Xz1cE33JvBRUhdht5sbPrfbf6Gb"
//     ),
//   },
//   // autoConnect: false, // Disable auto-connect to prevent modal from opening on load
// });

// export default function WalletProvider({ children }: { children: ReactNode }) {
//   const [queryClient] = useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>
//       <WagmiProvider config={config}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </WagmiProvider>
//     </QueryClientProvider>
//   );
// }

// --------------------------------------------------------------------------

"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected,  metaMask } from "wagmi/connectors";

// Define the Pepe Unchained Mainnet network
const pepeUnchained = {
  id: 97741, // Correct chain ID
  name: "Pepe Unchained Mainnet",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",
  iconBackground: "#fff",
  nativeCurrency: { name: "PEPE", symbol: "PEPU", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc-pepu-v2-mainnet-0.t.conduit.xyz"], // Your specified RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: "Pepe Explorer",
      url: "https://explorer-explorer-pepu-v2-mainnet-0.t.conduit.xyz", // Update if you have the correct explorer URL
    },
  },
};

// MFG Token contract address
export const MFG_TOKEN_ADDRESS = "0x434DD2AFe3BAf277ffcFe9Bef9787EdA6b4C38D5";

export const config = createConfig({
  chains: [pepeUnchained],
  connectors: [
    injected(), // For browser extension wallets like MetaMask
    metaMask(), // Specifically for MetaMask
    // walletConnect({ projectId: "your-project-id" }), // Uncomment and add your WalletConnect project ID if needed
  ],
  transports: {
    [pepeUnchained.id]: http("https://rpc-pepu-v2-mainnet-0.t.conduit.xyz"),
  },
});

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
