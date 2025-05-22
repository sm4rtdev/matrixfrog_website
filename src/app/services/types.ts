// app/services/types.ts

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: number | string;
  formattedBalance?: string;
  network?: 'ethereum' | 'pepu-chain'; // Optional Netzwerk-Identifikator
}

export interface TokenTransfer {
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  transactionHash: string;
  explorerLink?: string;
  blockNumber?: number;
  network?: 'ethereum' | 'pepu-chain'; // Optional Netzwerk-Identifikator
  // Neue Felder für USD-Werte
  usdValue?: number;           // USD-Wert zum Zeitpunkt der Überweisung
  formattedUsdValue?: string;  // Formatierter USD-Wert (z.B. "$1.234,56")
  tokenPrice?: number;         // Token-Preis in USD zum Zeitpunkt der Überweisung
}

export interface Contributor {
  address: string;
  totalAmount: number;
  formattedAmount: string;
  transferCount: number;
  lastTransfer: string;
  explorerLink?: string;
  network?: 'ethereum' | 'pepu-chain'; // Optional Netzwerk-Identifikator
  // Optional: Auch hier können wir USD-Werte hinzufügen
  totalUsdValue?: number;
  formattedTotalUsdValue?: string;
}