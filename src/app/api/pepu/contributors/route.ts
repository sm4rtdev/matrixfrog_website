// app/api/pepu/contributors-from-tx/route.ts
import { NextResponse } from 'next/server';

// Interfaces für Transfers
interface TokenTransfer {
  from: string;
  to: string;
  value: string;
  formattedValue: string;
  timestamp: string;
  transactionHash: string;
  explorerLink?: string;
  blockNumber?: number;
}

// Interface für einen Contributor
interface Contributor {
  address: string;
  totalAmount: number;
  formattedAmount: string;
  transferCount: number;
  lastTransfer: string;
  explorerLink?: string;
}

// Interface für die Map von Adressen zu Contributors
interface ContributorMap {
  [key: string]: Contributor;
}

// Interface für Explorer-API Response Item
interface ExplorerTransferItem {
  from: {
    hash: string;
  };
  to: {
    hash: string;
  };
  total: {
    value: string;
  };
  timestamp: string;
  transaction_hash: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const token = searchParams.get('token');
  const limit = Number(searchParams.get('limit') || '21'); // Erhöht auf 21 für vollständige Daten
  
  if (!address || !token) {
    return NextResponse.json(
      { error: 'Adresse und Token-Adresse erforderlich' },
      { status: 400 }
    );
  }
  
  try {
    // Schritt 1: Zunächst alle Transfers über die Web3-API abrufen für maximale Vollständigkeit
    // Wir versuchen den Web3-Ansatz, da dieser vollständigere historische Daten hat
    const transfersUrl = `${new URL(request.url).origin}/api/pepu/transfers-web3?address=${address}&token=${token}&limit=1000`;
    
    console.log(`Requesting transfers from: ${transfersUrl}`);
    const transfersResponse = await fetch(transfersUrl);
    
    let transfers: TokenTransfer[] = [];
    
    if (transfersResponse.ok) {
      const transfersData = await transfersResponse.json();
      transfers = transfersData.transfers || [];
    } else {
      // Fallback zur normalen transfers-Route
      const fallbackUrl = `${new URL(request.url).origin}/api/pepu/transfers?address=${address}&token=${token}&limit=1000`;
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        transfers = fallbackData.transfers || [];
      } else {
        // Wenn beide fehlschlagen, können wir direkt die Explorer-API verwenden
        const explorerResponse = await fetch(
          `https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz/api/v2/addresses/${address}/token-transfers?type=ERC-20&token=${token}`
        );
        
        if (explorerResponse.ok) {
          const explorerData = await explorerResponse.json();
          
          // Konvertieren des Explorer-Formats zu unserem TokenTransfer-Format
          if (explorerData.items && Array.isArray(explorerData.items)) {
            transfers = explorerData.items.map((item: ExplorerTransferItem) => ({
              from: item.from.hash,
              to: item.to.hash,
              value: item.total.value,
              formattedValue: Math.floor(Number(item.total.value) / 10**18).toLocaleString('de-DE'),
              timestamp: item.timestamp,
              transactionHash: item.transaction_hash,
              explorerLink: `https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz/tx/${item.transaction_hash}`
            }));
          }
        }
      }
    }
    
    console.log(`Retrieved ${transfers.length} transfers for calculating contributors`);
    
    // Schritt 2: Contributors aus den Transfers berechnen
    const contributorMap: ContributorMap = {};
    
    // Nur eingehende Transfers berücksichtigen
    const incomingTransfers = transfers.filter(transfer => 
      transfer.to.toLowerCase() === address.toLowerCase()
    );
    
    incomingTransfers.forEach(transfer => {
      const fromAddress = transfer.from.toLowerCase();
      
      // Überspringen, wenn Wallet an sich selbst sendet
      if (fromAddress === address.toLowerCase()) {
        return;
      }
      
      // Wert extrahieren und in Zahlen umwandeln
      let value = 0;
      if (transfer.value) {
        // Umwandlung des Wertes vom Wei-Format (Rohdaten)
        value = Number(transfer.value) / 10**18;
      } else if (transfer.formattedValue) {
        // Falls bereits formatiert, die Formatierung entfernen
        // (für de-DE Format mit Punkten als Tausendertrennzeichen)
        value = Number(transfer.formattedValue.replace(/\./g, ''));
      }
      
      if (!contributorMap[fromAddress]) {
        contributorMap[fromAddress] = {
          address: fromAddress,
          totalAmount: 0,
          formattedAmount: '0',
          transferCount: 0,
          lastTransfer: transfer.timestamp,
          explorerLink: `https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz/address/${fromAddress}`
        };
      }
      
      contributorMap[fromAddress].totalAmount += value;
      contributorMap[fromAddress].transferCount += 1;
      
      // Formatierte Summe aktualisieren
      contributorMap[fromAddress].formattedAmount = Math.floor(contributorMap[fromAddress].totalAmount).toLocaleString('de-DE');
      
      // Letztes Transfer-Datum aktualisieren, wenn neuer
      const currentDate = new Date(contributorMap[fromAddress].lastTransfer);
      const transferDate = new Date(transfer.timestamp);
      
      if (transferDate > currentDate) {
        contributorMap[fromAddress].lastTransfer = transfer.timestamp;
      }
    });
    
    // In Array umwandeln und nach Gesamtbeitrag sortieren
    const contributors = Object.values(contributorMap)
      .sort((a: Contributor, b: Contributor) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
    
    // Debug-Info
    console.log(`Calculated ${contributors.length} contributors from ${incomingTransfers.length} incoming transfers`);
    
    // Erfolgreiche Antwort
    return NextResponse.json({
      contributors,
      totalContributors: Object.keys(contributorMap).length,
      basedOnTransfers: transfers.length
    });
  } catch (error) {
    console.error('Error calculating contributors from transactions:', error);    
    
    return NextResponse.json(
      { error: 'Fehler beim Berechnen der Contributors', contributors: [] },
      { status: 500 }
    );
  }
}