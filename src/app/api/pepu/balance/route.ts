// app/api/pepu/balance/route.ts - Optimized version
import { NextResponse } from "next/server";

// PEPU Explorer URL
const PEPU_EXPLORER_URL =
  "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz";

// Enhanced cache system with separate cache for each token type
const balanceCache: {
  [key: string]: {
    timestamp: number;
    balance: string;
    formattedBalance: string;
  };
} = {};

// Improved cache TTL settings - different TTLs for different tokens
const DEFAULT_CACHE_TTL = 30000; // 30 seconds for most tokens
const MATRIX_CACHE_TTL = 15000; // 15 seconds for MatrixFrog (more frequently updated)

// Define interface for token data
interface TokenData {
  token?: {
    address?: string;
    decimals?: string;
  };
  value?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const token = searchParams.get("token");
  const forceRefresh = searchParams.get("refresh") === "true";

  if (!address) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  // Check if requesting native PEPU balance
  const isNative = token === "native" || !token;

  // Cache key generation
  const cacheKey = `${address.toLowerCase()}_${
    isNative ? "native" : token?.toLowerCase()
  }`;
  const now = Date.now();

  // Determine appropriate cache TTL based on token
  const isMatrixToken =
    token?.toLowerCase() === "0x2044682dad187456af1eee1b4e02bbf0a9abc919";
  const cacheTTL = isMatrixToken ? MATRIX_CACHE_TTL : DEFAULT_CACHE_TTL;

  // Use cache if available and not expired
  if (
    !forceRefresh &&
    balanceCache[cacheKey] &&
    now - balanceCache[cacheKey].timestamp < cacheTTL
  ) {
    return NextResponse.json({
      balance: balanceCache[cacheKey].balance,
      formattedBalance: balanceCache[cacheKey].formattedBalance,
      token: isNative ? "native" : token,
      fromCache: true,
    });
  }

  try {
    // Set timeout for the request (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let balance = "0";
    let decimals = 18; // Default decimals

    if (isNative) {
      // Native PEPU token on L2
      const apiUrl = `${PEPU_EXPLORER_URL}/api/v2/addresses/${address}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
        next: { revalidate: 30 }, // Use Next.js cache for 30 seconds
      });

      if (!response.ok) {
        throw new Error(`PEPU Explorer API Error: ${response.status}`);
      }

      const data = await response.json();

      // Native balance is typically found under coin_balance or balance
      if (!data.coin_balance && !data.balance) {
        throw new Error("Native PEPU balance not found");
      }

      balance = data.coin_balance || data.balance;
    } else {
      // ERC20 token on PEPU Chain - Optimize to fetch multiple tokens at once when possible
      const apiUrl = `${PEPU_EXPLORER_URL}/api/v2/addresses/${address}/token-balances`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
        next: { revalidate: 30 }, // Use Next.js cache for 30 seconds
      });

      if (!response.ok) {
        throw new Error(`PEPU Explorer API Error: ${response.status}`);
      }

      const data = await response.json();

      // Find the token in the balances list
      const tokenData = data.find(
        (item: TokenData) =>
          item.token &&
          item.token.address &&
          item.token.address.toLowerCase() === token?.toLowerCase()
      );

      if (tokenData) {
        balance = tokenData.value || "0";
        decimals = parseInt(tokenData.token?.decimals || "18");

        // Common tokens with non-standard decimals for safety
        if (
          token?.toLowerCase() === "0xFa6882945A345d6b74e87A8d810d3B9dD3043162"
        ) {
          // USDT on PEPU Chain
          decimals = 6;
        }
      } else {
        console.log(`Token ${token} not found for address ${address}`);
      }
    }

    // Clear timeout
    clearTimeout(timeoutId);

    // Calculate formatted balance
    try {
      // Use BigInt for large numbers
      const balanceInWei = BigInt(balance);
      const balanceValue = Number(balanceInWei) / Math.pow(10, decimals);

      // Format with thousand separators, no decimal places
      const formattedBalance = Math.floor(balanceValue).toLocaleString("de-DE");

      // Store in cache
      balanceCache[cacheKey] = {
        timestamp: now,
        balance: balanceInWei.toString(),
        formattedBalance,
      };

      return NextResponse.json({
        balance: balanceInWei.toString(),
        formattedBalance,
      });
    } catch (numberError) {
      console.error("Error converting balance to number:", numberError);

      return NextResponse.json({
        balance: "0",
        formattedBalance: "0",
        error: "Error converting balance value",
      });
    }
  } catch (error) {
    console.error("Error fetching PEPU Chain balance:", error);

    // If error but we have cached data, use it
    if (balanceCache[cacheKey]) {
      return NextResponse.json({
        balance: balanceCache[cacheKey].balance,
        formattedBalance: balanceCache[cacheKey].formattedBalance,
        token: isNative ? "native" : token,
        fromCache: true,
        warning: "Error fetching current data, using cached data",
      });
    }

    // Return error response
    return NextResponse.json(
      { error: "Error fetching PEPU Chain balance" },
      { status: 500 }
    );
  }
}
