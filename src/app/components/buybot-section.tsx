"use client";

import React, { useState } from "react";

export default function BuyBotSection() {
  // State for the active tab
  const [activeTab, setActiveTab] = useState<"what" | "how">("what");

  // Contract Info
  const contractAddress = "0x434DD2AFe3BAf277ffcFe9Bef9787EdA6b4C38D5";
  const [copied, setCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Tab content
  const tabContents = {
    what: (
      <div className="terminal-text-container">
        <h3 className="text-matrix-green font-bold text-xl mb-4">What is Peptrix?</h3>
        <p className="text-white leading-relaxed mb-4">
          You&apos;ve stumbled into the Peptrix, a community-driven &ldquo;choose your own adventure&rdquo; video series where you dictate the narrative!
        </p>
        <p className="text-white leading-relaxed mb-4">
          At the end of each Peptrix episode, you&apos;ll enter the Construct and send MatrixFrog to one of two wallets. The wallet that receives the most MatrixFrog by the end of the voting period will determine the next episode&apos;s storyline.
        </p>
        <p className="text-white leading-relaxed mb-4">
          Dive into the first episode of the Peptrix series, <b>Flying Dreams</b>, and begin shaping your reality!
        </p>
      </div>
    ),
    how: (
      <div className="terminal-text-container">
        <h3 className="text-matrix-green font-bold text-xl mb-4">How to Participate</h3>
        <p className="text-white leading-relaxed mb-4">
          To unlock the Construct and participate, you&apos;ll need to hold at least <b>100,000 MatrixFrog</b>.
        </p>
        <p className="text-white leading-relaxed mb-4">
          You can acquire MatrixFrog by swapping Pepe Unchained on their website. Just copy the MatrixFrog Contract Address below and paste it into the swap function at
          <a href="https://pepuswap.com/#/swap" target="_blank" rel="noopener noreferrer" className="text-matrix-green hover:text-white ml-1 underline">pepuswap.com</a>.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-matrix-green font-extrabold text-[18px]">MatrixFrog Contract Address:</span>
          <code className="text-white text-sm break-all">{contractAddress}</code>
          <button
            onClick={() => copyToClipboard(contractAddress)}
            className="text-matrix-green hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </button>
          {copied && <span className="ml-2 text-xs text-matrix-green">Copied!</span>}
        </div>
        <p className="text-white leading-relaxed mb-4">
          If you&apos;re new to Pepe Unchained and need to acquire and bridge it first, you can find detailed instructions on their website:
          <a href="https://pepeunchained.com" target="_blank" rel="noopener noreferrer" className="text-matrix-green hover:text-white ml-1 underline">pepeunchained.com</a>.
        </p>
      </div>
    ),
  };

  return (
    <section id="peptrix" className="w-full min-h-screen py-16 md:py-24 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-90 z-10"></div>
      <div className="buybot-grid-noise"></div>
      <div className="buybot-grid-lines"></div>
      <div className="max-w-3xl w-full mx-auto px-4 relative z-20">
        {/* Main Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-matrix-green">What is Peptrix?</h2>
        </div>
        {/* Terminal Frame with Tabs and Video (all in one box) */}
        <div className="terminal-frame info-container mb-8 border border-matrix-green rounded-lg p-[30px]">
          <div className="terminal-header flex items-center justify-between">
            <div className="flex items-center">
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
              <span className="terminal-dot"></span>
            </div>
            <div className="terminal-tabs flex ml-auto gap-0 text-green-500">
              <button
                onClick={() => setActiveTab("what")}
                className={`px-6 py-2 font-semibold text-base md:text-lg focus:outline-none border border-matrix-green bg-transparent transition-all duration-200 h-[40px] ${activeTab === "what"
                  ? "bg-matrix-green text-black shadow-[0_0_8px_2px_#00ff41,0_0_16px_4px_#00ff41]"
                  : "text-matrix-green hover:bg-matrix-green/10"
                  }`}
                style={{ minWidth: 90, borderRadius: 0, color: '#00ff41', border: '1px solid #00ff41' }}
              >
                WHAT
              </button>
              <button
                onClick={() => setActiveTab("how")}
                className={`px-6 py-2 font-semibold text-base md:text-lg focus:outline-none border border-matrix-green bg-transparent transition-all duration-200 h-[40px] ${activeTab === "how"
                  ? "bg-matrix-green text-black shadow-[0_0_8px_2px_#00ff41,0_0_16px_4px_#00ff41]"
                  : "text-matrix-green hover:bg-matrix-green/10"
                  }`}
                style={{ minWidth: 90, borderRadius: 0, color: '#00ff41', border: '1px solid #00ff41' }}
              >
                HOW
              </button>
            </div>
          </div>
          <div className="terminal-content">
            {tabContents[activeTab]}
            {/* Video Embed - inside the same terminal frame */}
            <div className="mt-8 flex flex-col items-center w-[60%] mx-auto items-center">
              <div className="w-full max-w-sm aspect-video overflow-hidden border border-matrix-green" style={{ borderRadius: 0 }}>
                <div className="w-full h-full" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/0roDfig5Ycs"
                    title="Peptrix Episode 1: Flying Dreams"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      minHeight: '160px',
                      maxHeight: '1000px',
                      background: 'black',
                      borderRadius: 0,
                    }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
