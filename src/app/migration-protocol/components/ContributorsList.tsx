// app/api/components/wallet-tracker/ContributorsList.tsx

import React, { useEffect } from 'react';

// Interface für Contributor
interface Contributor {
  address: string;
  totalAmount: number;
  formattedAmount: string;
  transferCount: number;
  lastTransfer: string;
  explorerLink?: string;
  network?: 'ethereum' | 'pepu-chain';
}

interface ContributorsListProps {
  matrixContributors: Contributor[];
  matrixLoading: boolean;
  formatDate: (dateStr: string) => string;
  formatAmount: (amount: string) => string;
  shortenAddress: (address: string) => string;
}

const ContributorsList: React.FC<ContributorsListProps> = ({
  matrixContributors,
  matrixLoading,
  formatDate,
  formatAmount,
  shortenAddress
}) => {
  // Debug-Logs für die Contributors-Daten
  useEffect(() => {
    console.log("ContributorsList - Matrix Contributors:", matrixContributors);
  }, [matrixContributors]);
  
  // Stelle sicher, dass das Array immer initialisiert ist
  const safeMatrixContributors = matrixContributors || [];
  
  return (
    <div className="terminal-frame contributors-terminal mb-6">
      <div className="terminal-header">
        {/* Dots Container */}
        <div className="terminal-dots-container">
          <span className="terminal-dot"></span>
          <span className="terminal-dot"></span>
          <span className="terminal-dot"></span>
        </div>
        
        {/* Terminal Title */}
        <div className="terminal-title">
          TOP CONTRIBUTORS
        </div>
      </div>
      
      <div className="terminal-content p-4">
        {/* Matrix Contributors */}
        <>
          {matrixLoading ? (
            <div className="text-center py-6">
              <div className="text-green-500 animate-pulse font-mono">ANALYZING DATA...</div>
              <div className="matrix-loader mt-4"></div>
            </div>
          ) : safeMatrixContributors.length === 0 ? (
            <div className="text-center py-6 text-green-600 font-mono">NO CONTRIBUTORS DETECTED</div>
          ) : (
            <div className="contributors-list full-height-scroll custom-scrollbar">
              <div className="contributor-table">
                {/* Header-Zeile */}
                <div className="contributor-header sticky top-0 bg-black bg-opacity-95 z-10">
                  <div className="contributor-cell head-cell">RANK</div>
                  <div className="contributor-cell head-cell">ADDRESS</div>
                  <div className="contributor-cell head-cell text-right">AMOUNT</div>
                  <div className="contributor-cell head-cell text-right">INFO</div>
                </div>
                
                {/* Contributor-Zeilen */}
                {safeMatrixContributors.map((contributor: Contributor, idx: number) => (
                  <div 
                    key={`matrix-${idx}`}
                    className={`contributor-row ${idx < 3 ? 'top-contributor' : ''}`}
                  >
                    <div className="contributor-cell rank-cell">
                      {idx + 1}.
                    </div>
                    <div className="contributor-cell address-cell">
                      {shortenAddress(contributor.address)}
                    </div>
                    <div className="contributor-cell amount-cell">
                      {formatAmount(contributor.formattedAmount)}
                    </div>
                    <div className="contributor-cell info-cell">
                      <span className="transfer-count">{contributor.transferCount}×</span>
                      <span className="last-date">({formatDate(contributor.lastTransfer)})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      </div>
      
      <div className="terminal-content pt-0 px-4 pb-2">
        <div className="text-center text-xs text-green-700 mt-2">
          <span className="contributors-stat">
            {`${safeMatrixContributors.length} TOTAL MATRIX CONTRIBUTORS (L2)`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContributorsList;