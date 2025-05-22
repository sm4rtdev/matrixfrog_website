'use client';

import React, { useEffect, useState, useCallback } from 'react';
import StatusCards from './StatusCards';
import TransactionList from './TransactionList';
import ContributorsList from './ContributorsList';
import { 
  loadAllWalletData,
  MATRIX_LIQUIDITY_WALLET
} from '../../services/tokenService';

// Lokale Interface-Definitionen
interface TokenTransfer {
  hash: string;  // Nicht optional, da TransactionList es so erwartet
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  explorerLink?: string;
  network?: 'ethereum' | 'pepu-chain';
  transactionHash?: string;
}

interface Contributor {
  address: string;
  totalAmount: number;
  formattedAmount: string;
  transferCount: number;
  lastTransfer: string;
  explorerLink?: string;
  network?: 'ethereum' | 'pepu-chain';
}

import './styles.css';

const WalletTracker: React.FC = () => {
  // States für Matrix Token
  const [matrixBalance, setMatrixBalance] = useState<string>('...');
  const [matrixTotalCollected, setMatrixTotalCollected] = useState<string>('...');
  const [matrixTransfers, setMatrixTransfers] = useState<TokenTransfer[]>([]);
  const [matrixContributors, setMatrixContributors] = useState<Contributor[]>([]);
  const [matrixLoading, setMatrixLoading] = useState<boolean>(true);
  const [matrixTransfersLoading, setMatrixTransfersLoading] = useState<boolean>(true);
  const [matrixContributorsLoading, setMatrixContributorsLoading] = useState<boolean>(true);
  
  // States für PEPU & USDT auf Layer 2
  const [pepuL2Balance, setPepuL2Balance] = useState<string>('...');
  const [pepuL2Loading, setPepuL2Loading] = useState<boolean>(true);
  const [usdtL2Balance, setUsdtL2Balance] = useState<string>('...');
  const [usdtL2Loading, setUsdtL2Loading] = useState<boolean>(true);
  
  // Allgemeine States
  const [error, setError] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  // Tabs und Ansicht
  const [matrixActiveTab, setMatrixActiveTab] = useState<'in' | 'out' | 'all'>('all');
  const [matrixTransactionsVisible, setMatrixTransactionsVisible] = useState<boolean>(false);

  // Hilfsfunktionen
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
             ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return 'Invalid date';
    }
  };
  
  const shortenAddress = (address: string): string => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: string): string => {
    try {
      if (!amount.includes(',') && !amount.includes('.')) return amount;
      
      if (amount.includes(',') && amount.split(',')[1].length === 3) {
        const wholePart = amount.split(',')[0];
        if (wholePart.length <= 3) return amount + ".000";
      }
      
      return amount;
    } catch (error) {
      console.error('Fehler bei Betragsformatierung:', error);
      return amount;
    }
  };

  // Schreibmaschinenanimationseffekt
  useEffect(() => {
    const textToType = "Migration Wallet";
    if (currentCharIndex < textToType.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + textToType[currentCharIndex]);
        setCurrentCharIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, typedText]);

  // Berechnen von Gesamtbeträgen
  const calculateMatrixTotalCollected = useCallback((transfers: TokenTransfer[]) => {
    try {
      let total = 0;
      const incomingTransfers = transfers.filter(transfer => 
        transfer.to.toLowerCase() === MATRIX_LIQUIDITY_WALLET.toLowerCase()
      );
      
      incomingTransfers.forEach(transfer => {
        const cleanedValue = transfer.formattedValue.replace(/\./g, '');
        const amount = parseInt(cleanedValue);
        if (!isNaN(amount)) total += amount;
      });
      
      return total.toLocaleString('de-DE');
    } catch (error) {
      console.error('Fehler bei der Berechnung:', error);
      return "0";
    }
  }, []);

  // UI-Interaktionen
  const toggleMatrixTransactions = () => {
    setMatrixTransactionsVisible(!matrixTransactionsVisible);
  };

  const viewMatrixContributors = () => {};

  // Hilfsfunktion für die Verarbeitung der Transfers
const processTransfers = (transfers: {
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  transactionHash?: string;
  hash?: string;
  explorerLink?: string;
  network?: 'ethereum' | 'pepu-chain';
}[]): TokenTransfer[] => {
  return transfers.map(transfer => ({
    ...transfer,
    hash: transfer.transactionHash || transfer.hash || ''
  }));
};

  // Hauptdatenladung
  useEffect(() => {
    // OPTIMIERTE FUNKTION: Alle L2-Daten parallel laden
    async function fetchL2Data() {
      try {
        // Alle L2-Loading-States aktivieren
        setMatrixLoading(true);
        setPepuL2Loading(true);
        setUsdtL2Loading(true);
        setMatrixTransfersLoading(true);
        setMatrixContributorsLoading(true);
        setError(null);
        
        // Alle Daten parallel laden mit der neuen optimierten Funktion
        const data = await loadAllWalletData(MATRIX_LIQUIDITY_WALLET);
        
        // Balances verarbeiten
        if (data.balances["$MATRIX"]) {
          setMatrixBalance(data.balances["$MATRIX"].formattedBalance || '0');
        } else {
          setMatrixBalance('Nicht verfügbar');
        }
        
        if (data.balances["PEPU"]) {
          setPepuL2Balance(data.balances["PEPU"].formattedBalance || '0');
        } else {
          setPepuL2Balance('Nicht verfügbar');
        }
        
        if (data.balances["USDT"]) {
          setUsdtL2Balance(data.balances["USDT"].formattedBalance || '0');
        } else {
          setUsdtL2Balance('Nicht verfügbar');
        }
        
        // Transfers und Contributors verarbeiten
        const processedTransfers = processTransfers(data.transfers);
        setMatrixTransfers(processedTransfers);
        setMatrixContributors(data.contributors);
        
        // Total collected berechnen
        const total = calculateMatrixTotalCollected(processedTransfers);
        setMatrixTotalCollected(total);
        
      } catch (err) {
        console.error('Error loading L2 data:', err);
        setError('Failed to load data');
        setMatrixBalance('Nicht verfügbar');
        setPepuL2Balance('Nicht verfügbar');
        setUsdtL2Balance('Nicht verfügbar');
        setMatrixTotalCollected('Nicht verfügbar');
        setMatrixTransfers([]);
        setMatrixContributors([]);
      } finally {
        // Alle Loading-States zurücksetzen
        setMatrixLoading(false);
        setPepuL2Loading(false);
        setUsdtL2Loading(false);
        setMatrixTransfersLoading(false);
        setMatrixContributorsLoading(false);
      }
    }
    
    // Initial laden
    fetchL2Data();
    
    // Alle 2 Minuten aktualisieren
    const dataInterval = setInterval(fetchL2Data, 120000);
    
    return () => clearInterval(dataInterval);
  }, [calculateMatrixTotalCollected]);

  // Filter für Transaktionen
  const filteredMatrixTransfers = matrixTransfers.filter(transfer => {
    const isIncoming = transfer.to.toLowerCase() === MATRIX_LIQUIDITY_WALLET.toLowerCase();
    if (matrixActiveTab === 'in') return isIncoming;
    if (matrixActiveTab === 'out') return !isIncoming;
    return true;
  });
  
  return (
    <section id="community-wallet" className="w-full py-16 md:py-24 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-90 z-10"></div>
      <div className="matrix-grid-noise"></div>
      <div className="matrix-grid-lines"></div>
      
      <div className="max-w-6xl w-full mx-auto px-4 relative z-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="typing-effect">{typedText}</span>
            <span className="typing-cursor">|</span>
          </h2>
        </div>
        
        {/* StatusCards mit den korrekten Props */}
        <StatusCards 
          matrixBalance={matrixBalance}
          matrixTotalCollected={matrixTotalCollected}
          matrixLoading={matrixLoading}
          
          // Dummy-Werte für die erforderlichen PEPU L1 Props
          pepuBalance="0"
          pepuTotalCollected="0"
          pepuLoading={false}
          
          // L2 Werte
          pepuL2Balance={pepuL2Balance}
          pepuL2Loading={pepuL2Loading}
          
          // USDT Werte
          usdtL1Balance="0"
          usdtL1Loading={false}
          usdtL2Balance={usdtL2Balance}
          usdtL2Loading={usdtL2Loading}
          
          error={error}
          matrixWallet={MATRIX_LIQUIDITY_WALLET}
          pepuWallet=""
          
          onToggleMatrixTransactions={toggleMatrixTransactions}
          onTogglePepuTransactions={() => {}}
          onViewMatrixContributors={viewMatrixContributors}
          onViewPepuContributors={() => {}}
          
          formatAmount={formatAmount}
          matrixTransactionsVisible={matrixTransactionsVisible}
          pepuTransactionsVisible={false}
        />
        
        {matrixTransactionsVisible && (
          <TransactionList
            title="MATRIX TRANSACTIONS"
            transfers={filteredMatrixTransfers}
            isLoading={matrixTransfersLoading}
            activeTab={matrixActiveTab}
            onTabChange={setMatrixActiveTab}
            walletAddress={MATRIX_LIQUIDITY_WALLET}
            formatDate={formatDate}
            formatAmount={formatAmount}
            shortenAddress={shortenAddress}
          />
        )}
        
        <ContributorsList
          matrixContributors={matrixContributors}
          matrixLoading={matrixContributorsLoading}
          formatDate={formatDate}
          formatAmount={formatAmount}
          shortenAddress={shortenAddress}
        />
        
        <div className="text-center mt-6 text-green-700 font-mono text-sm">
          <p>THE MIGRATION WALLET STORES TOKENS ON PEPU-CHAIN L2</p>
        </div>
      </div>
    </section>
  );
};

export default WalletTracker;