// app/api/pepu/transfers/route.ts - Reine Explorer API Lösung ohne Hardcodes
import { NextResponse } from 'next/server';

// Konstanten
const PEPU_EXPLORER_URL = "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz";
const EXPLORER_API_URL = "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz/api/v2";

// Interface für unsere TokenTransfer-Struktur
interface TokenTransfer {
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  transactionHash: string;
  explorerLink: string;
  blockNumber: number;
}

// Interface für die Explorer API-Antwort (Token-Transfer)
interface ExplorerTokenTransfer {
  block_number?: number;
  from: {
    hash: string;
  };
  to: {
    hash: string;
  };
  token: {
    address: string;
    decimals: string;
  };
  total: {
    value: string;
  };
  transaction_hash: string;
  timestamp?: string | null;
  type: string;
}

interface ExplorerResponse {
  items: ExplorerTokenTransfer[];
  next_page_params: {
    block_number?: number;
    index?: number;
  } | null;
}

// Cache für die Transfers
const transfersCache: Record<string, TokenTransfer[]> = {};
const isLoadingMap: Record<string, boolean> = {};

// Debug-Flag
const DEBUG = true;

// Debuggen-Funktion
function log(message: string, data?: unknown): void {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
  }
}

/**
 * Formatiert den Wert basierend auf den Dezimalstellen
 */
function formatTokenValue(value: string, decimals: string): string {
  try {
    const decimalPlaces = parseInt(decimals);
    const valueNum = Number(value) / Math.pow(10, decimalPlaces);
    return Math.floor(valueNum).toLocaleString('de-DE');
  } catch (error) {
    console.error('Fehler bei der Formatierung des Token-Werts:', error);
    return value;
  }
}

/**
 * Hilfsfunktion zur Verarbeitung von API-Antwort-Items
 */
function processItems(items: ExplorerTokenTransfer[], transfers: TokenTransfer[], walletAddress: string, tokenAddress?: string): void {
  for (const item of items) {
    // Wenn ein Token-Filter gesetzt ist, prüfen ob es passt
    if (tokenAddress && item.token.address.toLowerCase() !== tokenAddress.toLowerCase()) {
      continue;
    }
    
    // Prüfen, ob das Item die Wallet als Sender oder Empfänger hat
    if (item.from.hash.toLowerCase() !== walletAddress.toLowerCase() && 
        item.to.hash.toLowerCase() !== walletAddress.toLowerCase()) {
      continue;
    }
    
    // Transfer-Objekt erstellen
    const transfer: TokenTransfer = {
      from: item.from.hash.toLowerCase(),
      to: item.to.hash.toLowerCase(),
      value: item.total.value,
      formattedValue: formatTokenValue(item.total.value, item.token.decimals),
      timestamp: item.timestamp || new Date().toISOString(),
      transactionHash: item.transaction_hash,
      explorerLink: `${PEPU_EXPLORER_URL}/tx/${item.transaction_hash}`,
      blockNumber: item.block_number || 0
    };
    
    // Transfer zum Array hinzufügen, wenn noch nicht vorhanden
    const isDuplicate = transfers.some(t => t.transactionHash === transfer.transactionHash);
    if (!isDuplicate) {
      transfers.push(transfer);
      log(`Transfer hinzugefügt: ${transfer.transactionHash}`);
    }
  }
}

/**
 * Holt alle Token-Transfers für eine Adresse von der Explorer API
 */
async function getAllTokenTransfers(
  walletAddress: string,
  tokenAddress: string,
  limit: number = 100
): Promise<TokenTransfer[]> {
  const transfers: TokenTransfer[] = [];
  let nextPageParams: { block_number?: number; index?: number } | null = { block_number: undefined, index: undefined };
  let hasMorePages = true;
  let pageCount = 0;
  const MAX_PAGES = 50; // Maximale Anzahl von Seiten, die wir abrufen
  
  log(`Hole Token-Transfers für Wallet ${walletAddress} und Token ${tokenAddress}`);
  
  try {
    // Strategie 1: /addresses/{address}/token-transfers API
    // Schleife für Paginierung
    while (hasMorePages && (limit <= 0 || transfers.length < limit) && pageCount < MAX_PAGES) {
      pageCount++;
      
      // Basis-URL erstellen
      let url = `${EXPLORER_API_URL}/addresses/${walletAddress}/token-transfers?type=ERC-20`;
      
      // Filter für Token
      if (tokenAddress) {
        url += `&token=${tokenAddress}`;
      }
      
      // Paginierung hinzufügen, wenn verfügbar
      if (nextPageParams && nextPageParams.block_number !== undefined && nextPageParams.index !== undefined) {
        url += `&block_number=${nextPageParams.block_number}&index=${nextPageParams.index}`;
      }
      
      log(`API-Aufruf Seite ${pageCount}: ${url}`);
      
      // API aufrufen
      const response = await fetch(url);
      
      // Wenn die token-transfers API Fehler zurückgibt, versuchen wir alternative Ansätze
      if (!response.ok) {
        log(`API-Fehler: ${response.status} ${response.statusText}`);
        
        if (pageCount === 1) {
          // Wenn die erste Seite fehlschlägt, switch zu Strategie 2
          break;
        }
        
        // Bei Fehler die Paginierung beenden
        hasMorePages = false;
        continue;
      }
      
      const data: ExplorerResponse = await response.json();
      
      // Verarbeitung der Antwort
      if (data && data.items && data.items.length > 0) {
        processItems(data.items, transfers, walletAddress, tokenAddress);
        
        // Nächste Seite prüfen
        nextPageParams = data.next_page_params;
        hasMorePages = nextPageParams !== null;
        
        if (hasMorePages) {
          // Rate-Limiting: Kurze Pause zwischen API-Aufrufen
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } else {
        // Keine weiteren Items
        hasMorePages = false;
      }
    }
    
    // Wenn wir das Seitenlimit erreicht haben, aber mehr Daten verfügbar wären
    if (pageCount >= MAX_PAGES && hasMorePages) {
      log(`Warnung: Maximale Seitenzahl (${MAX_PAGES}) erreicht. Es könnten weitere Transfers existieren.`);
    }
    
    // Strategie 2: /tokens/{tokenAddress}/transfers API
    if (transfers.length === 0 || pageCount === 1) {
      try {
        log(`Versuche alternative API: Token-Transfers für Token ${tokenAddress}`);
        const tokenUrl = `${EXPLORER_API_URL}/tokens/${tokenAddress}/transfers?type=ERC-20`;
        
        const tokenResponse = await fetch(tokenUrl);
        if (tokenResponse.ok) {
          const tokenData: ExplorerResponse = await tokenResponse.json();
          
          // Filtern nach der gesuchten Wallet-Adresse
          processItems(tokenData.items, transfers, walletAddress, tokenAddress);
          
          log(`${transfers.length} Transfers über Token-API gefunden`);
        }
      } catch (tokenError) {
        console.error('Fehler beim alternativen API-Aufruf:', tokenError);
      }
    }
    
    // Strategie 3: Alle Wallet-Transaktionen durchsuchen
    if (transfers.length === 0) {
      await checkAllWalletTransactions(walletAddress, tokenAddress, transfers);
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Token-Transfers von der Explorer API:', error);
  }
  
  log(`Insgesamt ${transfers.length} Token-Transfers gefunden`);
  
  // Nach Blocknummer sortieren (absteigend)
  return transfers.sort((a, b) => b.blockNumber - a.blockNumber);
}

/**
 * Durchsucht alle Transaktionen einer Wallet nach Token-Transfers
 */
async function checkAllWalletTransactions(
  walletAddress: string,
  tokenAddress: string,
  transfers: TokenTransfer[]
): Promise<void> {
  try {
    // Hole alle Transaktionen für die Wallet
    const url = `${EXPLORER_API_URL}/addresses/${walletAddress}/transactions`;
    log(`Suche in allen Wallet-Transaktionen: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      log(`Fehler beim Abrufen aller Wallet-Transaktionen: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      log(`Keine Transaktionen gefunden für Wallet ${walletAddress}`);
      return;
    }
    
    // Verarbeite jede Transaktion einzeln
    const txCount = data.items.length;
    log(`${txCount} Wallet-Transaktionen gefunden, prüfe auf Token-Transfers`);
    
    // Begrenzen auf max. 20 Transaktionen, um API-Überlastung zu vermeiden
    const MAX_TX_TO_CHECK = 20;
    const txsToCheck = data.items.slice(0, MAX_TX_TO_CHECK);
    
    for (const tx of txsToCheck) {
      const txHash = tx.hash;
      
      try {
        // Prüfe Token-Transfers in dieser Transaktion
        const txUrl = `${EXPLORER_API_URL}/transactions/${txHash}/token-transfers`;
        const txResponse = await fetch(txUrl);
        
        if (!txResponse.ok) {
          continue;
        }
        
        const txData: ExplorerResponse = await txResponse.json();
        if (txData.items && txData.items.length > 0) {
          processItems(txData.items, transfers, walletAddress, tokenAddress);
        }
        
        // Kurze Pause zwischen API-Aufrufen
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (txError) {
        console.error(`Fehler beim Abrufen der Token-Transfers für Transaktion ${txHash}:`, txError);
      }
    }
    
    if (txCount > MAX_TX_TO_CHECK) {
      log(`Hinweis: Nur die ersten ${MAX_TX_TO_CHECK} von ${txCount} Transaktionen wurden geprüft.`);
    }
  } catch (error) {
    console.error('Fehler beim Durchsuchen aller Wallet-Transaktionen:', error);
  }
}

// API-Route-Handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const token = searchParams.get('token');
  const limit = Number(searchParams.get('limit') || '100');
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  if (!address || !token) {
    return NextResponse.json(
      { error: 'Adresse und Token-Adresse erforderlich' },
      { status: 400 }
    );
  }
  
  // Cache-Key erstellen
  const cacheKey = `${address.toLowerCase()}_${token.toLowerCase()}`;
  
  // Verhindern von gleichzeitigen Anfragen für dieselbe Adresse/Token
  if (isLoadingMap[cacheKey] && !forceRefresh) {
    return NextResponse.json({
      transfers: transfersCache[cacheKey]?.slice(0, limit) || [],
      message: 'Daten werden geladen, Cache wird zurückgegeben'
    });
  }
  
  try {
    isLoadingMap[cacheKey] = true;
    
    // Cache leeren, wenn forceRefresh aktiviert ist
    if (forceRefresh) {
      delete transfersCache[cacheKey];
    }
    
    // Cached Transfers verwenden, wenn verfügbar
    if (transfersCache[cacheKey] && transfersCache[cacheKey].length > 0) {
      return NextResponse.json({
        transfers: transfersCache[cacheKey].slice(0, limit),
        totalTransfers: transfersCache[cacheKey].length
      });
    }
    
    // Alle Token-Transfers abrufen
    const transfers = await getAllTokenTransfers(address, token, limit);
    
    // Cache aktualisieren
    transfersCache[cacheKey] = transfers;
    
    // Erfolgreiche Antwort mit Transfers
    return NextResponse.json({
      transfers: transfers.slice(0, limit),
      totalTransfers: transfers.length
    });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    
    return NextResponse.json(
      { 
        error: 'Fehler beim Abrufen der Transfers',
        transfers: transfersCache[cacheKey]?.slice(0, limit) || []
      },
      { status: 500 }
    );
  } finally {
    isLoadingMap[cacheKey] = false;
  }
}