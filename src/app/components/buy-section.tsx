// "use client";

// import React, { useState } from "react";
// import Image from "next/image";

// export default function BuySection() {
//     const [activeTab, setActiveTab] = useState<"contract" | "how" | "dex">("contract");

//     // Contract information
//     const contractAddress = "0x434DD2AFe3BAf277ffcFe9Bef9787EdA6b4C38D5";
//     const networkName = "Pepe Unchained";
//     const networkId = "97741";
//     const rpcUrl = "https://rpc-pepu-v2-mainnet-0.t.conduit.xyz";
//     const explorerUrl = "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz";

//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText(text);
//         // You could add a toast notification here
//     };

//     const tabContents = {
//         contract: (
//             <div className="terminal-text-container">
//                 <h3 className="text-matrix-green font-bold text-xl mb-4">
//                     MatrixFrog Token Contract
//                 </h3>
//                 <p className="text-white leading-relaxed mb-6">
//                     MatrixFrog ($MATRIX) is deployed on the Pepe Unchained network. Below you'll find all the essential contract information needed to add the token to your wallet and start trading.
//                 </p>

//                 <div className="space-y-4">
//                     <div className="bg-black bg-opacity-30 border border-matrix-green rounded-lg p-4">
//                         <h4 className="text-matrix-green font-bold mb-2">Contract Address</h4>
//                         <div className="flex items-center gap-2">
//                             <code className="text-white text-sm break-all">{contractAddress}</code>
//                             <button
//                                 onClick={() => copyToClipboard(contractAddress)}
//                                 className="text-matrix-green hover:text-white transition-colors"
//                                 title="Copy to clipboard"
//                             >
//                                 <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bg-black bg-opacity-30 border border-matrix-green rounded-lg p-4">
//                         <h4 className="text-matrix-green font-bold mb-2">Network Information</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                             <div>
//                                 <span className="text-matrix-green">Network:</span>
//                                 <span className="text-white ml-2">{networkName}</span>
//                             </div>
//                             <div>
//                                 <span className="text-matrix-green">Chain ID:</span>
//                                 <span className="text-white ml-2">{networkId}</span>
//                             </div>
//                             <div>
//                                 <span className="text-matrix-green">RPC URL:</span>
//                                 <span className="text-white ml-2 break-all">{rpcUrl}</span>
//                             </div>
//                             <div>
//                                 <span className="text-matrix-green">Explorer:</span>
//                                 <a
//                                     href={explorerUrl}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-matrix-green hover:text-white ml-2 transition-colors"
//                                 >
//                                     View on Explorer
//                                 </a>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-black bg-opacity-30 border border-matrix-green rounded-lg p-4">
//                         <h4 className="text-matrix-green font-bold mb-2">Token Details</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                             <div>
//                                 <span className="text-matrix-green">Symbol:</span>
//                                 <span className="text-white ml-2">$MATRIX</span>
//                             </div>
//                             <div>
//                                 <span className="text-matrix-green">Decimals:</span>
//                                 <span className="text-white ml-2">18</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ),
//         how: (
//             <div className="terminal-text-container">
//                 <h3 className="text-matrix-green font-bold text-xl mb-4">
//                     How to Buy MatrixFrog
//                 </h3>

//                 <div className="space-y-6">
//                     <div>
//                         <h4 className="text-white font-bold mb-3">Step 1: Add Pepe Unchained Network</h4>
//                         <p className="text-white leading-relaxed mb-3">
//                             First, you need to add the Pepe Unchained network to your wallet. You can do this manually or use the "Add Network" button in our navbar.
//                         </p>
//                         <div className="bg-black bg-opacity-30 border border-matrix-green rounded-lg p-3 text-sm">
//                             <p className="text-matrix-green mb-1">Network Details:</p>
//                             <p className="text-white">Name: Pepe Unchained Mainnet</p>
//                             <p className="text-white">Chain ID: 97741</p>
//                             <p className="text-white">Currency: PEPU</p>
//                             <p className="text-white">RPC: https://rpc-pepu-v2-mainnet-0.t.conduit.xyz</p>
//                         </div>
//                     </div>

//                     <div>
//                         <h4 className="text-white font-bold mb-3">Step 2: Get PEPU Tokens</h4>
//                         <p className="text-white leading-relaxed mb-3">
//                             You'll need PEPU tokens to buy MatrixFrog. You can bridge ETH from Ethereum mainnet to Pepe Unchained using the official bridge.
//                         </p>
//                         <a
//                             href="https://bridge.pepeunchained.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-block bg-matrix-green text-black px-4 py-2 rounded hover:bg-matrix-green-dark transition-colors"
//                         >
//                             Bridge to Pepe Unchained
//                         </a>
//                     </div>

//                     <div>
//                         <h4 className="text-white font-bold mb-3">Step 3: Add MatrixFrog Token</h4>
//                         <p className="text-white leading-relaxed mb-3">
//                             Add the MatrixFrog token to your wallet using the contract address above. This will allow you to see your $MATRIX balance.
//                         </p>
//                     </div>

//                     <div>
//                         <h4 className="text-white font-bold mb-3">Step 4: Trade on DEX</h4>
//                         <p className="text-white leading-relaxed mb-3">
//                             Use a decentralized exchange (DEX) on Pepe Unchained to swap PEPU for $MATRIX tokens. Popular DEXs include:
//                         </p>
//                         <ul className="list-disc pl-6 text-white space-y-1">
//                             <li>PepuSwap</li>
//                             <li>Uniswap V3 (if available)</li>
//                             <li>Other Pepe Unchained DEXs</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         ),
//         dex: (
//             <div className="terminal-text-container">
//                 <h3 className="text-matrix-green font-bold text-xl mb-4">
//                     Decentralized Exchanges
//                 </h3>

//                 <p className="text-white leading-relaxed mb-6">
//                     Trade MatrixFrog tokens on these decentralized exchanges available on the Pepe Unchained network.
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-black bg-opacity-30 border border-matrix-green rounded-lg p-4">
//                         <h4 className="text-matrix-green font-bold mb-2">PepuSwap</h4>
//                         <p className="text-white text-sm mb-3">
//                             The native DEX for the Pepe Unchained ecosystem. Trade PEPU for $MATRIX tokens with low fees and high liquidity.
//                         </p>
//                         <a
//                             href="https://pepuswap.pepeunchained.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-block bg-matrix-green text-black px-3 py-1 rounded text-sm hover:bg-matrix-green-dark transition-colors"
//                         >
//                             Trade on PepuSwap
//                         </a>
//                     </div>

//                     <div className="bg-black bg-opacity-30 border border-matrix-green rounded-lg p-4">
//                         <h4 className="text-matrix-green font-bold mb-2">Other DEXs</h4>
//                         <p className="text-white text-sm mb-3">
//                             As the Pepe Unchained ecosystem grows, more DEXs will become available. Check the official Pepe Unchained documentation for the latest options.
//                         </p>
//                         <a
//                             href="https://docs.pepeunchained.com"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-block bg-matrix-green text-black px-3 py-1 rounded text-sm hover:bg-matrix-green-dark transition-colors"
//                         >
//                             View Documentation
//                         </a>
//                     </div>
//                 </div>

//                 <div className="mt-6 bg-black bg-opacity-30 border border-matrix-green rounded-lg p-4">
//                     <h4 className="text-matrix-green font-bold mb-2">Trading Pair</h4>
//                     <p className="text-white text-sm">
//                         <span className="text-matrix-green">PEPU/$MATRIX</span> - This is the main trading pair for MatrixFrog tokens on Pepe Unchained.
//                     </p>
//                 </div>
//             </div>
//         ),
//     };

//     return (
//         <section className="buy-section py-16 px-4">
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-12">
//                     <h2 className="text-4xl md:text-5xl font-bold text-matrix-green mb-4">
//                         Buy MatrixFrog
//                     </h2>
//                     <p className="text-white text-lg max-w-3xl mx-auto">
//                         Join the MatrixFrog community by acquiring $MATRIX tokens on the Pepe Unchained network
//                     </p>
//                 </div>

//                 {/* Tab Navigation */}
//                 <div className="flex flex-wrap justify-center mb-8 gap-2">
//                     {[
//                         { id: "contract", label: "Contract Info" },
//                         { id: "how", label: "How to Buy" },
//                         { id: "dex", label: "DEXs" },
//                     ].map((tab) => (
//                         <button
//                             key={tab.id}
//                             onClick={() => setActiveTab(tab.id as any)}
//                             className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.id
//                                 ? "bg-matrix-green text-black"
//                                 : "bg-transparent border border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black"
//                                 }`}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Tab Content */}
//                 <div className="bg-black bg-opacity-20 border border-matrix-green rounded-lg p-6 md:p-8">
//                     {tabContents[activeTab]}
//                 </div>

//                 {/* Matrix Frog Image */}
//                 <div className="text-center mt-12">
//                     <Image
//                         src="/MFG.png"
//                         alt="MatrixFrog"
//                         width={200}
//                         height={200}
//                         className="mx-auto opacity-80"
//                     />
//                 </div>
//             </div>
//         </section>
//     );
// } 