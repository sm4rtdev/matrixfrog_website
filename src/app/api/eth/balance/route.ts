// app/api/eth/balance/route.ts
import { NextResponse } from 'next/server';

// Get API key from environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "YOUR_API_KEY_HERE";

// Simple cache system
const balanceCache: {
  [key: string]: {
    timestamp: number,
    balance: string,
    formattedBalance: string
  }
} = {};

// Cache TTL in ms (1 minute)
const CACHE_TTL = 60000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const token = searchParams.get('token');
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }
  
  // For native ETH balance, we don't need a token address
  const isNative = token === 'native' || !token;
  
  // Cache key generation
  const cacheKey = `${address.toLowerCase()}_${isNative ? 'native' : token?.toLowerCase()}`;
  const now = Date.now();
  
  // Use cache if available and not expired
  if (!forceRefresh && 
      balanceCache[cacheKey] &&
      now - balanceCache[cacheKey].timestamp < CACHE_TTL) {
    
    return NextResponse.json({
      balance: balanceCache[cacheKey].balance,
      formattedBalance: balanceCache[cacheKey].formattedBalance,
      token: isNative ? 'native' : token,
      fromCache: true
    });
  }
  
  try {
    // Set timeout for the request (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    let url;
    let decimals = 18; // Default decimals
    
    if (isNative) {
      // Native ETH balance
      url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    } else {
      // ERC20 token balance
      url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token}&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
      
      // Common tokens with non-standard decimals
      if (token?.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7') { // USDT
        decimals = 6;
      }
    }
    
    console.log(`Fetching balance from: ${url}`);
    
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store'
    });
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Etherscan API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== '1') {
      throw new Error(`Etherscan API Error: ${data.message}`);
    }
    
    // Calculate balance with appropriate decimals
    const balance = data.result;
    const balanceValue = Number(balance) / (10 ** decimals);
    
    // Format with thousand separators, no decimal places
    const formattedBalance = Math.floor(balanceValue).toLocaleString('de-DE');
    
    // Store in cache
    balanceCache[cacheKey] = {
      timestamp: now,
      balance,
      formattedBalance
    };
    
    return NextResponse.json({
      balance,
      formattedBalance
    });
  } catch (error) {
    console.error('Error fetching Ethereum balance:', error);
    
    // If error but we have cached data, use it
    if (balanceCache[cacheKey]) {
      return NextResponse.json({
        balance: balanceCache[cacheKey].balance,
        formattedBalance: balanceCache[cacheKey].formattedBalance,
        token: isNative ? 'native' : token,
        fromCache: true,
        warning: 'Error fetching current data, using cached data'
      });
    }
    
    // Return error response
    return NextResponse.json(
      { error: 'Error fetching Ethereum balance' },
      { status: 500 }
    );
  }
}