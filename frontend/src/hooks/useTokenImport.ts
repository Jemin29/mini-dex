"use client";

import { useState } from "react";
import type { Token } from "@/types/tokens";

export function useTokenImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importToken = async (token: Token, image?: string) => {
    if (typeof window === "undefined" || !window.ethereum?.request) {
      setError("No compatible wallet found.");
      return false;
    }

    try {
      setIsImporting(true);
      setError(null);
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image
          }
        }
      });

      return Boolean(wasAdded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Token import failed.");
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importToken,
    isImporting,
    error
  };
}
