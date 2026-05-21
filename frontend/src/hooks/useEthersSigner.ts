"use client";

import { useEffect, useState } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useAccount } from "wagmi";

export function useEthersSigner() {
  const { isConnected } = useAccount();
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSigner() {
      if (!isConnected || typeof window === "undefined" || !window.ethereum) {
        if (mounted) {
          setSigner(null);
          setIsReady(true);
        }
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const nextSigner = await provider.getSigner();
      if (mounted) {
        setSigner(nextSigner);
        setIsReady(true);
      }
    }

    loadSigner();
    return () => {
      mounted = false;
    };
  }, [isConnected]);

  return { signer, isReady };
}
