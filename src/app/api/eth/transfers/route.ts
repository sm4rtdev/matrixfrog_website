// app/api/eth/transfers/route.ts
import { NextResponse } from 'next/server';

// Get API key from environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "YOUR_API_KEY_HERE";

// Cache für Transfers
interface TokenTransfer {
  hash: string;
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  transactionHash: string;
  explorerLink: string;
  blockNumber: number;
  network: 'ethereum';
}

// Cache für Ethereum Transfers
const transfersCache: { [key: string]: TokenTransfer[] } = {};
const lastCheckedTimestampMap: { [key: string]: number } = {};
const isLoadingMap: { [key: string]: boolean } = {};

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
  
  // Cache-Key generieren
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
    if (forceRefresh && transfersCache[cacheKey]) {
      delete transfersCache[cacheKey];
      delete lastCheckedTimestampMap[cacheKey];
    }
    
    // Aktuelle Zeit für Cache-Prüfung
    const now = Date.now();
    
    // Prüfen, ob wir innerhalb der letzten 10 Minuten bereits geprüft haben
    // (außer bei forceRefresh)
    if (!forceRefresh && 
        lastCheckedTimestampMap[cacheKey] && 
        now - lastCheckedTimestampMap[cacheKey] < 600000) {
      
      console.log(`Returning cached transfers for ${address}, token ${token}`);
      
      return NextResponse.json({
        transfers: transfersCache[cacheKey]?.slice(0, limit) || [],
        totalTransfers: transfersCache[cacheKey]?.length || 0,
        fromCache: true
      });
    }
    
    // ERC20 Token Transfers von der Etherscan API abrufen
    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${token}&address=${address}&page=1&offset=10000&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    console.log(`Fetching transfers from Etherscan for ${address}, token ${token}`);
    
    const response = await fetch(etherscanUrl, {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Etherscan API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== '1') {
      throw new Error(`Etherscan API Error: ${data.message}`);
    }
    
    if (!data.result || !Array.isArray(data.result)) {
      throw new Error('Unexpected Etherscan API response format');
    }
    
    // Transfers transformieren
    const transfers: TokenTransfer[] = [];
    const seenTxHashes = new Set<string>(); // Um Duplikate zu vermeiden
    
    for (const item of data.result) {
      // Duplikate überspringen
      if (seenTxHashes.has(item.hash)) {
        continue;
      }
      
      seenTxHashes.add(item.hash);
      
      // Wir sind nur an Transfers zu/von der Wallet interessiert
      if (item.from.toLowerCase() !== address.toLowerCase() && 
          item.to.toLowerCase() !== address.toLowerCase()) {
        continue;
      }
      
      // Token-Dezimalstellen
      const decimals = parseInt(item.tokenDecimal) || 18;
      
      // Wert in lesbare Form umwandeln
      const valueNum = Number(item.value) / (10 ** decimals);
      
      // Timestamp aus dem Block umwandeln
      const timestamp = new Date(parseInt(item.timeStamp) * 1000).toISOString();
      
      transfers.push({
        hash: item.hash,
        from: item.from,
        to: item.to,
        value: item.value,
        formattedValue: Math.floor(valueNum).toLocaleString('de-DE'),
        timestamp,
        transactionHash: item.hash,
        explorerLink: `https://etherscan.io/tx/${item.hash}`,
        blockNumber: parseInt(item.blockNumber),
        network: 'ethereum'
      });
    }
    
    // Nach neuesten Transaktionen sortieren
    transfers.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
    
    // Im Cache speichern
    transfersCache[cacheKey] = transfers;
    lastCheckedTimestampMap[cacheKey] = now;
    
    console.log(`Cached ${transfers.length} transfers for ${address}, token ${token}`);
    
    return NextResponse.json({
      transfers: transfers.slice(0, limit),
      totalTransfers: transfers.length
    });
  } catch (error) {
    console.error('Error fetching token transfers:', error);
    
    // Wenn ein Fehler auftritt, aber wir haben Cache-Daten, verwenden wir diese
    if (transfersCache[cacheKey]) {
      return NextResponse.json({
        transfers: transfersCache[cacheKey]?.slice(0, limit) || [],
        totalTransfers: transfersCache[cacheKey]?.length || 0,
        fromCache: true,
        warning: 'Fehler beim Abrufen aktueller Daten, Cache-Daten werden verwendet'
      });
    }
    
    // Ansonsten einen Fehler zurückgeben
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Token-Transfers' },
      { status: 500 }
    );
  } finally {
    isLoadingMap[cacheKey] = false;
  }
}