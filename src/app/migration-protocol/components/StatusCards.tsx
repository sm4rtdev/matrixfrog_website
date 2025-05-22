// app/api/components/wallet-tracker/StatusCards.tsx

import React, { useState, useEffect } from 'react';

interface StatusCardsProps {
  matrixBalance: string;
  matrixTotalCollected: string;
  matrixLoading: boolean;
  pepuBalance: string;
  pepuTotalCollected: string;
  pepuLoading: boolean;
  pepuL2Balance: string;
  pepuL2Loading: boolean;
  // Neue Props für USDT
  usdtL1Balance: string;
  usdtL1Loading: boolean;
  usdtL2Balance: string;
  usdtL2Loading: boolean;
  error: string | null;
  matrixWallet: string;
  pepuWallet: string;
  formatAmount: (amount: string) => string;
  onToggleMatrixTransactions: () => void;
  onTogglePepuTransactions: () => void;
  onViewMatrixContributors: () => void;
  onViewPepuContributors: () => void;
  matrixTransactionsVisible: boolean;
  pepuTransactionsVisible: boolean;
}

const StatusCards: React.FC<StatusCardsProps> = ({
  matrixBalance,
  matrixTotalCollected,
  matrixLoading,
  pepuL2Balance,
  pepuL2Loading,
  usdtL2Balance,
  usdtL2Loading,
  error,
  matrixWallet,  
  formatAmount,
  onToggleMatrixTransactions,  
  onViewMatrixContributors,  
  matrixTransactionsVisible,  
}) => {
  const [copied, setCopied] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState<string>('500,000,000');
  const [goalReached, setGoalReached] = useState<boolean>(false);

  const handleMatrixViewClick = () => {
    onToggleMatrixTransactions();
    if (!matrixTransactionsVisible) {
      onViewMatrixContributors();
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Berechne den verbleibenden Betrag
  useEffect(() => {
    if (matrixTotalCollected) {
      try {
        const collected = parseFloat(matrixTotalCollected.replace(/\./g, ''));
        const remaining = 500000000 - collected;
        
        // Prüfen, ob das Ziel erreicht wurde
        if (remaining <= 0) {
          setGoalReached(true);
          setRemainingAmount('0');
        } else {
          setGoalReached(false);
          setRemainingAmount(remaining.toLocaleString('de-DE')); // Punktformat bleibt konsistent
        }

      } catch (e) {
        console.error('Error calculating remaining amount:', e);
      }
    }
  }, [matrixTotalCollected]);

  const [lastUpdatedText, setLastUpdatedText] = useState<string>("just now");
  const [lastUpdateTime] = useState<number>(Date.now());

  useEffect(() => {
    const updateTimeSince = () => {
      const secondsPassed = Math.floor((Date.now() - lastUpdateTime) / 1000);
      
      if (secondsPassed < 5) {
        setLastUpdatedText("just now");
      } else if (secondsPassed < 60) {
        setLastUpdatedText(`${secondsPassed} sec ago`);
      } else if (secondsPassed < 3600) {
        const minutes = Math.floor(secondsPassed / 60);
        setRemainingAmount(remainingAmount => remainingAmount); // Keep existing value
        setLastUpdatedText(`${minutes} min ago`);
      } else {
        const hours = Math.floor(secondsPassed / 3600);
        setLastUpdatedText(`${hours} hr ago`);
      }
    };

    updateTimeSince();
    const intervalId = setInterval(updateTimeSince, 15000);
    return () => clearInterval(intervalId);
  }, [lastUpdateTime]);

  return (
    <>
      {/* Community Wallet Title Bar */}
      <div className="wallet-title-bar">
        <div className="wallet-title-content">          
          <div 
            className={`wallet-address-display-large ${copied ? 'copied' : ''}`}
            onClick={() => copyToClipboard(matrixWallet)}
            title="Click to copy address"
          >
            <div className="address-with-frame">
              <span>{matrixWallet}</span>
              <div className="address-frame"></div>
            </div>
            {copied && <span className="copy-feedback">Copied!</span>}
          </div>
        </div>
      </div>
      
      {/* Hauptcontainer für die Network Panels */}
      <div className="wallet-dashboard-container">
        {/* Network Panels Container zentriert mit nur einem Panel */}
        <div className="wallet-networks-container-centered">
          {/* PEPU-Chain Netzwerk (L2) */}
          <div className="network-panel pepu-chain">
            <div className="network-header">
              <div className="network-tag">L2</div>
              <div className="network-name">PEPU-CHAIN</div>
            </div>
            
            <div className="tokens-container">
              {/* PEPU Token auf L2 */}
              <div className="token-card">
                <div className="token-symbol">PEPU</div>
                <div className="token-badge">NATIVE</div>
                <div className="token-balance">
                  {pepuL2Loading ? (
                    <div className="loading-placeholder">LOADING...</div>
                  ) : (
                    <span>{formatAmount(pepuL2Balance)}</span>
                  )}
                </div>
              </div>
              
              {/* MATRIX Token auf L2 */}
              <div className="token-card highlighted">
                <div className="token-symbol">MATRIX</div>
                <div className="token-balance">
                  {matrixLoading ? (
                    <div className="loading-placeholder">LOADING...</div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : (
                    <span>{formatAmount(matrixBalance)}</span>
                  )}
                </div>
                {/* Erweiterte Anzeige für gesammelte und verbleibende Beträge */}
                <div className="token-collected-large">
                  <div className="collected-section">
                    <span className="label">Collected:</span> 
                    <span className="value pulse-glow">{matrixTotalCollected}</span>
                  </div>
                  <div className="remaining-section">
                    <span className="label">Remaining:</span> 
                    {goalReached ? (
                      <span className="value goal-reached">GOAL REACHED!</span>
                    ) : (
                      <span className="value">{remainingAmount}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* USDT Token auf L2 */}
              <div className="token-card">
                <div className="token-symbol">USDT</div>
                <div className="token-balance">
                  {usdtL2Loading ? (
                    <div className="loading-placeholder">LOADING...</div>
                  ) : (
                    <span>{formatAmount(usdtL2Balance)}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* View Button in einem Container mit fester Position */}
            <div className="view-button-container">
              <button 
                className="view-data-btn pepu-chain" 
                onClick={handleMatrixViewClick}
              >
                {matrixTransactionsVisible ? 'HIDE TRANSACTIONS' : 'VIEW TRANSACTIONS'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Separate Komponente für die Dashboard-Statistiken/Infobox */}
      <div className="wallet-stats-container mb-8">
        <div className="wallet-stats">
          <div className="stat-item">
            <div className="stat-label">TOTAL ASSETS</div>
            <div className="stat-value">1 NETWORK · 3 TOKENS</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">LAST UPDATED</div>
            <div className="stat-value">{lastUpdatedText}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusCards;