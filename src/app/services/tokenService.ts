// app/services/tokenservice.ts

"use client";

import { TokenInfo, TokenTransfer, Contributor } from "./types";

// PEPU Explorer URL für Transaction-Links
const PEPU_EXPLORER_URL =
  "https://explorer-pepe-unchained-gupg0lo9wf.t.conduit.xyz";

// MatrixFrog Token Information
const MATRIX_TOKEN = {
  address: "0x2044682dad187456af1eee1b4e02bbf0a9abc919",
  symbol: "$MATRIX",
  name: "MatrixFrog Frog",
  decimals: 18,
  network: "pepu-chain" as const,
};

// PEPU L2 Token Information (als native Chain-Währung)
const PEPU_L2_TOKEN = {
  address: "native", // Spezialwert für natives Token
  symbol: "PEPU",
  name: "PEPU",
  decimals: 18,
  network: "pepu-chain" as const,
};

// USDT L2 Token Information
const USDT_L2_TOKEN = {
  address: "0xFa6882945A345d6b74e87A8d810d3B9dD3043162",
  symbol: "USDT",
  name: "Tether USD",
  decimals: 6,
  network: "pepu-chain" as const,
};

// MatrixFrog Liquidity Wallet
const MATRIX_LIQUIDITY_WALLET = "0xa16217D221744974aB4f38eBC68c645c6E285039";

/**
 * Generiert einen Transaktions-Link für die PEPU Explorer Website
 */
export function getTransactionLink(txHash: string): string {
  return `${PEPU_EXPLORER_URL}/tx/${txHash}`;
}

/**
 * Generiert einen Adress-Link für die PEPU Explorer Website
 */
export function getAddressLink(address: string): string {
  return `${PEPU_EXPLORER_URL}/address/${address}`;
}

/**
 * Holt den Token-Balance für ein Token auf einer bestimmten Chain
 */
export async function getTokenBalance(
  walletAddress: string,
  token: TokenInfo
): Promise<TokenInfo | null> {
  try {
    // API-Route für PEPU-Chain
    const apiRoute = "/api/pepu/balance";

    // Parameter für die Anfrage erstellen
    const params = new URLSearchParams({
      address: walletAddress,
      token: token.address,
    });

    const url = `${apiRoute}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 15 }, // Kurze Revalidierungszeit für bessere Performance
    });

    if (!response.ok) {
      // API gab einen Fehler zurück
      const errorData = await response.json();
      throw new Error(errorData.error || `API Fehler: ${response.status}`);
    }

    const data = await response.json();

    // Prüfen, ob ein error-Feld in der Antwort vorhanden ist
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      ...token,
      balance: data.balance,
      formattedBalance: data.formattedBalance,
    };
  } catch (error) {
    console.error(`Fehler beim Abrufen des ${token.symbol} Balances:`, error);
    return null;
  }
}

/**
 * Holt Balances für mehrere Tokens in einem Batch-Request
 * für optimierte parallele Ladeleistung
 */
export async function getMultipleBalances(
  walletAddress: string = MATRIX_LIQUIDITY_WALLET,
  tokens: TokenInfo[] = [MATRIX_TOKEN, PEPU_L2_TOKEN, USDT_L2_TOKEN]
): Promise<{ [key: string]: TokenInfo | null }> {
  try {
    // Starte alle Token-Anfragen parallel
    const balancePromises = tokens.map((token) =>
      getTokenBalance(walletAddress, token)
    );

    // Warte auf alle Anfragen
    const results = await Promise.all(balancePromises);

    // Ergebnisse als Objekt mit Token-Symbol als Schlüssel zusammenfassen
    const balances: { [key: string]: TokenInfo | null } = {};
    tokens.forEach((token, index) => {
      balances[token.symbol] = results[index];
    });

    return balances;
  } catch (error) {
    console.error("Fehler beim Batch-Abrufen der Token-Balances:", error);

    // Rückgabe eines leeren Objekts im Fehlerfall
    const emptyResult: { [key: string]: TokenInfo | null } = {};
    tokens.forEach((token) => {
      emptyResult[token.symbol] = null;
    });

    return emptyResult;
  }
}

/**
 * Holt den MatrixFrog Token-Balance
 */
export async function getMatrixBalance(
  walletAddress: string = MATRIX_LIQUIDITY_WALLET
): Promise<TokenInfo | null> {
  return getTokenBalance(walletAddress, MATRIX_TOKEN);
}

/**
 * Holt den nativen PEPU L2 Token-Balance
 */
export async function getPepuL2Balance(
  walletAddress: string = MATRIX_LIQUIDITY_WALLET
): Promise<TokenInfo | null> {
  return getTokenBalance(walletAddress, PEPU_L2_TOKEN);
}

/**
 * Holt den USDT Token-Balance auf L2
 */
export async function getUsdtBalance(
  walletAddress: string = MATRIX_LIQUIDITY_WALLET
): Promise<TokenInfo | null> {
  return getTokenBalance(walletAddress, USDT_L2_TOKEN);
}

/**
 * Holt MatrixFrog Token-Transfers für eine bestimmte Wallet über die API
 */
export async function getMatrixTransfers(
  limit: number = 10
): Promise<TokenTransfer[]> {
  try {
    // Rufe unsere Transfers-API auf
    const url = `/api/pepu/transfers?address=${MATRIX_LIQUIDITY_WALLET}&token=${MATRIX_TOKEN.address}&limit=${limit}`;

    const response = await fetch(url, {
      cache: "no-store", // Explizit keine Caching, um immer aktuelle Daten zu erhalten
      next: { revalidate: 30 }, // Kurze Revalidierungszeit für Next.js API-Routen
    });

    if (!response.ok) {
      // API gab einen Fehler zurück
      const errorData = await response.json();
      throw new Error(errorData.error || `API Fehler: ${response.status}`);
    }

    const data = await response.json();

    // Prüfen, ob ein error-Feld in der Antwort vorhanden ist
    if (data.error) {
      throw new Error(data.error);
    }

    // Stellen sicher, dass jeder Transfer eine hash-Eigenschaft für die TransactionList hat
    return (data.transfers || []).map((transfer: TokenTransfer) => ({
      ...transfer,
      hash: transfer.transactionHash, // TransactionList erwartet eine hash-Eigenschaft
    }));
  } catch (error) {
    console.error("Fehler beim Abrufen der MATRIX-Transfers:", error);

    // Leeres Array zurückgeben, um Fehleranzeige auszulösen
    return [];
  }
}

/**
 * Holt die Top-Beitragenden für MATRIX
 */
export async function getMatrixContributors(
  limit: number = 21
): Promise<Contributor[]> {
  try {
    // Verwende bevorzugt die transaktionsbasierte Route
    const url = `/api/pepu/contributors-from-tx?address=${MATRIX_LIQUIDITY_WALLET}&token=${MATRIX_TOKEN.address}&limit=${limit}`;

    const response = await fetch(url, {
      cache: "no-store", // Explizit keine Caching, um immer aktuelle Daten zu erhalten
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      // Wenn die spezielle Route fehlschlägt, versuche die Standard-Route
      const fallbackUrl = `/api/pepu/contributors?address=${MATRIX_LIQUIDITY_WALLET}&token=${MATRIX_TOKEN.address}&limit=${limit}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        next: { revalidate: 30 },
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return (fallbackData.contributors || []).map(
          (contributor: Contributor) => ({
            ...contributor,
            explorerLink:
              contributor.explorerLink || getAddressLink(contributor.address),
          })
        );
      }

      // Wenn auch die Standard-Route fehlschlägt, wirf einen Fehler
      throw new Error("Beide Contributors-Routen sind fehlgeschlagen");
    }

    const data = await response.json();

    // Contributors mit Explorer-Links anreichern, falls noch nicht vorhanden
    return (data.contributors || []).map((contributor: Contributor) => ({
      ...contributor,
      explorerLink:
        contributor.explorerLink || getAddressLink(contributor.address),
    }));
  } catch (error) {
    console.error("Fehler beim Abrufen der MATRIX-Beitragenden:", error);

    // Leeres Array zurückgeben, um Fehleranzeige auszulösen
    return [];
  }
}

/**
 * Lädt alle Wallet-Daten parallel in einem optimierten Batch-Prozess
 */
export async function loadAllWalletData(
  walletAddress: string = MATRIX_LIQUIDITY_WALLET
): Promise<{
  balances: { [key: string]: TokenInfo | null };
  transfers: TokenTransfer[];
  contributors: Contributor[];
}> {
  try {
    // Starte alle Anfragen parallel
    const [balanceData, transfersData, contributorsData] = await Promise.all([
      getMultipleBalances(walletAddress),
      getMatrixTransfers(100000),
      getMatrixContributors(100),
    ]);

    return {
      balances: balanceData,
      transfers: transfersData,
      contributors: contributorsData,
    };
  } catch (error) {
    console.error("Fehler beim Laden aller Wallet-Daten:", error);
    return {
      balances: {},
      transfers: [],
      contributors: [],
    };
  }
}

// Export der Wallet-Adresse und Token-Informationen
export { MATRIX_LIQUIDITY_WALLET, MATRIX_TOKEN, PEPU_L2_TOKEN, USDT_L2_TOKEN };
