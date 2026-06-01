"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/hooks/useWalletAuth";

type WalletLoginButtonProps = {
  callbackUrl?: string;
};

export default function WalletLoginButton({ callbackUrl }: WalletLoginButtonProps) {
  const { signInWithWallet, isLoading, error, isConnected } = useWalletAuth();

  if (!isConnected) {
    return <ConnectButton showBalance={false} chainStatus="icon" />;
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" size="lg" onClick={() => signInWithWallet(callbackUrl)} disabled={isLoading}>
        {isLoading ? "Signing..." : "Sign in with wallet"}
      </Button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
