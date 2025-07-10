import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";

interface MobileMenuProps {
  getNavLink: (anchor: string) => string;
  setMenuOpen: (isOpen: boolean) => void;
  isConnected: boolean;
  isConnecting: boolean;
  connectMetaMask: () => void;
  connectWalletConnect: () => void;
  connectCoinbase: () => void;
  handleDisconnect: () => void;
  formattedAddress: string;
  tokenBalance: string;
  isCorrectNetwork: boolean;
  handleNetworkSwitch: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  getNavLink,
  setMenuOpen,
  isConnected,
  isConnecting,
  connectMetaMask,
  connectWalletConnect,
  connectCoinbase,
  handleDisconnect,
  formattedAddress,
  tokenBalance,
  isCorrectNetwork,
  handleNetworkSwitch
}) => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  return (
    <div className="mobile-menu">
      <div className="mobile-menu-container">
        <Link href={getNavLink("about")} onClick={() => setMenuOpen(false)}>
          <span className="mobile-menu-link hover-white">About</span>
        </Link>
        <Link href={getNavLink("buy")} onClick={() => setMenuOpen(false)}>
          <span className="mobile-menu-link hover-white">Buy</span>
        </Link>

        {/* Treasury */}
        <Link href="/migration-protocol" onClick={() => setMenuOpen(false)}>
          <span className="mobile-menu-link hover-white">Treasury</span>
        </Link>

        {/* Construct */}
        <div
          onClick={() => {
            if (!isConnected) {
              alert("Please connect your wallet first to access the Construct");
              return;
            }
            setMenuOpen(false);
            window.location.href = "/construct";
          }}
          style={{ cursor: "pointer" }}
        >
          <span className="mobile-menu-link hover-white">Construct</span>
        </div>

        {/* Roadmap */}
        <Link href={getNavLink("roadmap")} onClick={() => setMenuOpen(false)}>
          <span className="mobile-menu-link hover-white">Roadmap</span>
        </Link>

        <div className="mobile-social-container">
          {/* Telegram */}
          <a
            href="https://t.me/MatrixFrogPepu"
            className="social-button hover-white"
            aria-label="Telegram"
          >
            <div className="social-icon">
              <svg
                className="mobile-social-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </div>
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="https://x.com/Matrixfrog_"
            className="social-button hover-white"
            aria-label="X"
          >
            <div className="social-icon">
              <svg
                className="mobile-social-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </div>
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/CM2AfcfmCU"
            className="social-button hover-white"
            aria-label="Discord"
          >
            <div className="social-icon">
              <svg
                className="mobile-social-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
          </a>
        </div>

        {/* Mobile Wallet Connect */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isConnected ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "#4ade80", marginBottom: "4px" }}>
                {formattedAddress}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#16a34a", marginBottom: "8px" }}>
                $MATRIX: {isCorrectNetwork ? tokenBalance : "0"}
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <button
                  onClick={handleDisconnect}
                  style={{
                    padding: "4px 8px",
                    fontSize: "0.7rem",
                    backgroundColor: "transparent",
                    border: "1px solid #dc2626",
                    color: "#dc2626",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Disconnect
                </button>
                {!isCorrectNetwork && (
                  <button
                    onClick={handleNetworkSwitch}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      backgroundColor: "#dc2626",
                      border: "1px solid #dc2626",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Switch Network
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowWalletOptions(!showWalletOptions)}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  backgroundColor: "transparent",
                  border: "1px solid #4ade80",
                  color: "#4ade80",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg
                  style={{ width: "1rem", height: "1rem" }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>

              {showWalletOptions && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid #4ade80",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <button
                    onClick={() => {
                      connectMetaMask();
                      setShowWalletOptions(false);
                    }}
                    disabled={isConnecting}
                    style={{
                      padding: "6px 8px",
                      fontSize: "0.7rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#4ade80",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Image src="/metamask-icon.svg" alt="MetaMask" width={12} height={12} />
                    MetaMask
                  </button>
                  <button
                    onClick={() => {
                      connectWalletConnect();
                      setShowWalletOptions(false);
                    }}
                    disabled={isConnecting}
                    style={{
                      padding: "6px 8px",
                      fontSize: "0.7rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#4ade80",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Image src="/link-icon.svg" alt="WalletConnect" width={12} height={12} />
                    Wallet Connect
                  </button>
                  <button
                    onClick={() => {
                      connectCoinbase();
                      setShowWalletOptions(false);
                    }}
                    disabled={isConnecting}
                    style={{
                      padding: "6px 8px",
                      fontSize: "0.7rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#4ade80",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Image src="/coinbase-icon.svg" alt="Coinbase" width={12} height={12} />
                    Coinbase Wallet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
