import { env } from "@/lib/env";

const explorers: Record<number, string> = {
  1: "https://etherscan.io",
  11155111: "https://sepolia.etherscan.io",
  10: "https://optimistic.etherscan.io",
  8453: "https://basescan.org",
  42161: "https://arbiscan.io"
};

export function getExplorerBase() {
  return explorers[env.chainId] || "https://etherscan.io";
}

export function getExplorerTxUrl(hash?: string) {
  if (!hash) return "";
  return `${getExplorerBase()}/tx/${hash}`;
}
