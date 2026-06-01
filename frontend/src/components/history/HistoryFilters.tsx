"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TxStatus, TxType } from "@/types/tx";

const TYPE_OPTIONS: Array<TxType | "All"> = ["All", "Swap", "Add", "Remove"];
const STATUS_OPTIONS: Array<TxStatus | "All"> = ["All", "pending", "confirmed", "failed"];

type HistoryFiltersProps = {
  search: string;
  typeFilter: TxType | "All";
  statusFilter: TxStatus | "All";
  onlyMyWallet: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TxType | "All") => void;
  onStatusChange: (value: TxStatus | "All") => void;
  onWalletToggle: () => void;
};

export default function HistoryFilters({
  search,
  typeFilter,
  statusFilter,
  onlyMyWallet,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onWalletToggle
}: HistoryFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search hash, token, type"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="max-w-xs"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Type: {typeFilter}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {TYPE_OPTIONS.map((option) => (
            <DropdownMenuItem key={option} onClick={() => onTypeChange(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Status: {statusFilter}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem key={option} onClick={() => onStatusChange(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant={onlyMyWallet ? "default" : "outline"} onClick={onWalletToggle}>
        {onlyMyWallet ? "My wallet" : "All wallets"}
      </Button>
    </div>
  );
}
