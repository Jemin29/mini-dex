"use client";

import { Button } from "@/components/ui/button";
import { useChains } from "wagmi";

type UnsupportedNetworkBannerProps = {
  onSwitch: (chainId: number) => void;
};

export default function UnsupportedNetworkBanner({ onSwitch }: UnsupportedNetworkBannerProps) {
  const chains = useChains();
  const fallback = chains[0];

  if (!fallback) return null;

  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-200">
      <p className="font-semibold text-red-100">Unsupported network</p>
      <p className="mt-1">Switch to {fallback.name} to continue using the Mini DEX.</p>
      <Button size="sm" className="mt-3" onClick={() => onSwitch(fallback.id)}>
        Switch network
      </Button>
    </div>
  );
}
