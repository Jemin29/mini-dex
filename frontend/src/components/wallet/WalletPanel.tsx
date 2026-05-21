"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { useWalletActions } from "@/hooks/useWalletActions";
import UnsupportedNetworkBanner from "@/components/wallet/UnsupportedNetworkBanner";
import { formatNumber } from "@/lib/format";

export default function WalletPanel() {
  const { address, isConnected, isConnecting, isReconnecting, chainId, chains, isUnsupported, balanceQuery } = useWallet();
  const { disconnect, switchChainAsync, isSwitching } = useWalletActions();

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Connect a wallet to view balances and sign transactions.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {(isConnecting || isReconnecting) && (
          <p className="text-xs text-muted">Reconnecting wallet...</p>
        )}
        {isUnsupported && switchChainAsync && (
          <UnsupportedNetworkBanner onSwitch={(id) => switchChainAsync({ chainId: id })} />
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted">Address</span>
          <span className="font-semibold">{shortAddress}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Network</span>
          <span>{chains.find((c) => c.id === chainId)?.name || "Unknown"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Balance</span>
          <span>
            {balanceQuery.isLoading
              ? "Loading..."
              : `${formatNumber(Number(balanceQuery.data?.formatted || 0), 4)} ${balanceQuery.data?.symbol || ""}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {chains
            .filter((chain) => chain.id !== chainId)
            .slice(0, 2)
            .map((chain) => (
              <Button
                key={chain.id}
                size="sm"
                variant="outline"
                onClick={() => switchChainAsync({ chainId: chain.id })}
                disabled={isSwitching}
              >
                Switch to {chain.name}
              </Button>
            ))}
          <Button size="sm" variant="ghost" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
