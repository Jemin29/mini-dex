"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import WalletPanel from "@/components/wallet/WalletPanel";

export default function WalletMenu() {
  const { isConnected, address } = useWallet();
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  if (!isConnected) {
    return <ConnectButton showBalance={false} chainStatus="icon" />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{shortAddress}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wallet details</DialogTitle>
        </DialogHeader>
        <WalletPanel />
      </DialogContent>
    </Dialog>
  );
}
