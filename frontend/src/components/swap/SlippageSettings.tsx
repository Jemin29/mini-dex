"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSwapStore } from "@/state/swapStore";

const PRESETS = [0.1, 0.5, 1];

export default function SlippageSettings() {
  const { slippage, setSlippage } = useSwapStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Slippage: {slippage}%</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {PRESETS.map((value) => (
          <DropdownMenuItem key={value} onClick={() => setSlippage(value)}>
            {value}%
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
