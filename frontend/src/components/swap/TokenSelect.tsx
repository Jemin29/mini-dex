"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTokenList } from "@/hooks/useTokenList";
import { useSwapStore } from "@/state/swapStore";
import { Token } from "@/types/tokens";
import { cn } from "@/lib/utils";
import TokenLogo from "@/components/common/TokenLogo";

export default function TokenSelect({ variant }: { variant: "in" | "out" }) {
  const tokens = useTokenList();
  const { tokenIn, tokenOut, setTokenIn, setTokenOut } = useSwapStore();
  const selected = variant === "in" ? tokenIn : tokenOut;

  const handleSelect = (token: Token) => {
    if (variant === "in") {
      setTokenIn(token);
    } else {
      setTokenOut(token);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="min-w-[140px] justify-between gap-2">
          <div className="flex items-center gap-2">
            <TokenLogo token={selected} size="sm" />
            <span>{selected?.symbol || "Select"}</span>
          </div>
          <span className="text-muted" aria-hidden="true">▾</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select token</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {tokens.map((token) => (
            <button
              key={token.address}
              onClick={() => handleSelect(token)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border border-border px-3 py-3 text-left text-sm hover:bg-white/5",
                selected?.address === token.address && "border-accent/70"
              )}
            >
              <div className="flex items-center gap-3">
                <TokenLogo token={token} size="md" />
                <div>
                  <p className="font-semibold text-foreground">{token.symbol}</p>
                  <p className="text-xs text-muted">{token.name}</p>
                </div>
              </div>
              <span className="text-xs text-muted">{token.decimals} decimals</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
