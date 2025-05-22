import { NextResponse } from 'next/server';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "YOUR_API_KEY_HERE";

// Typdefinitionen für die Etherscan-API-Antwort
interface EtherscanTokenTransfer {
  to: string;
  from: string;
  value: string;
  tokenDecimal: string;
  timeStamp: string;
  contractAddress: string;
  hash: string;
  blockNumber: string;
  tokenName: string;
  tokenSymbol: string;
  gasUsed: string;
  gasPrice: string;
}

interface EtherscanResponse {
  status: string;
  message: string;
  result: EtherscanTokenTransfer[];
}

interface Contributor {
  address: string;
  totalAmount: number;
  transferCount: number;
  lastTransfer: string;
  formattedAmount?: string;
  explorerLink?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const token = searchParams.get('token');
  const limit = searchParams.get('limit') || "10";
  
  if (!address || !token) {
    return NextResponse.json(
      { error: 'Adresse und Token-Adresse erforderlich' },
      { status: 400 }
    );
  }
  
  try {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${token}&address=${address}&page=1&offset=1000&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    console.log(`Fetching data for contributors from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Etherscan API Fehler: ${response.status}`);
    }
    
    const data: EtherscanResponse = await response.json();
    
    if (data.status !== '1') {
      throw new Error(`Etherscan API Fehler: ${data.message}`);
    }
    
    const incomingTransfers = data.result.filter((tx) => 
      tx.to.toLowerCase() === address.toLowerCase()
    );
    
    const contributorsMap = new Map<string, Contributor>();
    
    incomingTransfers.forEach((tx) => {
      const senderAddress = tx.from;
      const decimals = parseInt(tx.tokenDecimal);
      const value = Number(tx.value) / (10 ** decimals);
      const timestamp = new Date(parseInt(tx.timeStamp) * 1000).toISOString();
      
      if (contributorsMap.has(senderAddress)) {
        const contributor = contributorsMap.get(senderAddress)!;
        contributor.totalAmount += value;
        contributor.transferCount += 1;
        
        if (new Date(timestamp) > new Date(contributor.lastTransfer)) {
          contributor.lastTransfer = timestamp;
        }
      } else {
        contributorsMap.set(senderAddress, {
          address: senderAddress,
          totalAmount: value,
          transferCount: 1,
          lastTransfer: timestamp
        });
      }
    });
    
    let contributors: Contributor[] = Array.from(contributorsMap.values());
    contributors.sort((a, b) => b.totalAmount - a.totalAmount);
    contributors = contributors.slice(0, parseInt(limit));
    
    contributors = contributors.map((contributor) => ({
      ...contributor,
      formattedAmount: Math.floor(contributor.totalAmount).toLocaleString('de-DE'),
      explorerLink: `https://etherscan.io/address/${contributor.address}`
    }));
    
    return NextResponse.json({ contributors });
  } catch (error) {
    console.error('Error calculating contributors:', error);
    return NextResponse.json({ contributors: [] });
  }
}