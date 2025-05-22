// app/api/components/wallet-tracker/TransactionList.tsx

import React from 'react';

// Verwende den importierten Typ aus dem Service
interface TokenTransfer {
  hash: string;
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  explorerLink?: string;
  network?: 'ethereum' | 'pepu-chain';
}

interface TransactionListProps {
  title: string;
  transfers: TokenTransfer[];
  isLoading: boolean;
  activeTab: 'in' | 'out' | 'all';
  onTabChange: (tab: 'in' | 'out' | 'all') => void;
  walletAddress: string;
  formatDate: (dateStr: string) => string;
  formatAmount: (amount: string) => string;
  shortenAddress: (address: string) => string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  title,
  transfers,
  isLoading,
  activeTab,
  onTabChange,
  walletAddress,
  formatDate,
  formatAmount,
  shortenAddress
}) => {
  const safeTransfers = transfers || [];
  
  return (
    <div className="terminal-frame transfers-terminal mb-6">
      <div className="terminal-header">
        {/* Dots Container */}
        <div className="terminal-dots-container">
          <span className="terminal-dot"></span>
          <span className="terminal-dot"></span>
          <span className="terminal-dot"></span>
        </div>
        
        {/* Terminal Title */}
        <div className="terminal-title">
          {title}
        </div>
        
        {/* Transfer-Typ-Tabs */}
        <div className="transfer-tabs">
          <button 
            onClick={() => onTabChange('all')} 
            className={`transfer-tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            ALL
          </button>
          <button 
            onClick={() => onTabChange('in')} 
            className={`transfer-tab ${activeTab === 'in' ? 'active' : ''}`}
          >
            INCOMING
          </button>
          <button 
            onClick={() => onTabChange('out')} 
            className={`transfer-tab ${activeTab === 'out' ? 'active' : ''}`}
          >
            OUTGOING
          </button>
        </div>
      </div>
      
      <div className="terminal-content p-4">
        {isLoading ? (
          <div className="text-center py-6">
            <div className="text-green-500 animate-pulse font-mono">SCANNING BLOCKCHAIN...</div>
            <div className="matrix-loader mt-4"></div>
          </div>
        ) : safeTransfers.length === 0 ? (
          <div className="text-center py-6 text-green-600 font-mono">NO TRANSACTIONS DETECTED</div>
        ) : (
          <div className="transfers-list full-height-scroll custom-scrollbar">
            <div className="transaction-table">
              {/* Header-Zeile - Desktop */}
              <div className="transaction-header hidden md:grid sticky top-0 bg-black bg-opacity-95 z-10">
                <div className="transaction-cell head-cell">TYPE</div>
                <div className="transaction-cell head-cell text-right">AMOUNT</div>
                <div className="transaction-cell head-cell">ADDRESS</div>
                <div className="transaction-cell head-cell text-right">DATE</div>
              </div>
              
              {/* Transaktionszeilen */}
              {safeTransfers.map((transfer, idx) => {
                const isIncoming = transfer.to.toLowerCase() === walletAddress.toLowerCase();
                
                return (
                  <div 
                    key={transfer.hash || idx} 
                    className={`transaction-row ${isIncoming ? 'transaction-in' : 'transaction-out'}`}
                  >
                    {/* Typ-Zelle */}
                    <div className="transaction-cell type-cell">
                      <div className={`type-indicator ${isIncoming ? 'in' : 'out'}`}>
                        {isIncoming ? "→ IN" : "← OUT"}
                      </div>
                    </div>
                    
                    {/* Betrags-Zelle */}
                    <div className="transaction-cell amount-cell">
                      <span className={`amount-value ${isIncoming ? 'in' : 'out'}`}>
                        {formatAmount(transfer.formattedValue)}
                      </span>
                    </div>
                    
                    {/* Adressen-Zelle */}
                    <div className="transaction-cell address-cell">
                      <span className="address-value">
                        {isIncoming 
                          ? shortenAddress(transfer.from)
                          : shortenAddress(transfer.to)
                        }
                      </span>
                    </div>
                    
                    {/* Datums-Zelle */}
                    <div className="transaction-cell date-cell">
                      <div className="date-container">
                        <span className="date-value">{formatDate(transfer.timestamp)}</span>
                        {transfer.explorerLink && (
                          <a 
                            href={transfer.explorerLink}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="tx-link"
                          >
                            [TX]
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="terminal-content pt-0 px-4 pb-2">
        <div className="text-center text-xs text-green-700 mt-2">
          <span className="transactions-stat">
            {`${safeTransfers.length} TOTAL TRANSACTIONS`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;