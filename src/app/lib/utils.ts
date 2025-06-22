import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseEther } from "viem";

// Tailwind class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Function to check if user has sufficient MFG balance
export const checkMFGBalance = (
  balance: bigint | null | undefined,
  requiredAmount: number | string
): boolean => {
  if (!balance) return false;
  return balance >= parseEther(requiredAmount.toString());
};

// ✅ Function to format MFG amount for display
export const formatMFGAmount = (amount: bigint): string => {
  const formatted = formatUnits(amount, 18);
  const numericValue = parseFloat(formatted);
  return numericValue.toLocaleString("en-US", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};
