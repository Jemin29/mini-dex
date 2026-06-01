"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTokenList } from "@/hooks/useTokenList";
import { useLiquidityStore } from "@/state/liquidityStore";
import { Token } from "@/types/tokens";
import { cn } from "@/lib/utils";
import TokenLogo from "@/components/common/TokenLogo";
import { useTokenImport } from "@/hooks/useTokenImport";

type LiquidityTokenSelectProps = {
  variant: "a" | "b";
};

export default function LiquidityTokenSelect({ variant }: LiquidityTokenSelectProps) {
  const tokens = useTokenList();
  const { tokenA, tokenB, setTokenA, setTokenB } = useLiquidityStore();
  const selected = variant === "a" ? tokenA : tokenB;
  const { importToken, isImporting } = useTokenImport();

  const handleSelect = (token: Token) => {
    if (variant === "a") {
      setTokenA(token);
    } else {
      setTokenB(token);
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
              <div className="flex items-center gap-3 text-xs text-muted">
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-foreground hover:border-accent/50"
                  onClick={(event) => {
                    event.stopPropagation();
                    importToken(token);
                  }}
                  disabled={isImporting}
                >
                  Import
                </button>
                <span>{token.decimals} decimals</span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
