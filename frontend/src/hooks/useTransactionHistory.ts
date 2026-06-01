"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import type { TransactionHistoryItem, TxStatus, TxType } from "@/types/tx";
import { fetchHistory } from "@/services/historyService";
import { useTxStore } from "@/state/txStore";
import { useHistoryEvents } from "@/hooks/useHistoryEvents";

export function useTransactionHistory() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TxType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<TxStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [onlyMyWallet, setOnlyMyWallet] = useState(true);

  const { address } = useAccount();
  const { history, cachedHistory, setCachedHistory } = useTxStore();

  useHistoryEvents(onlyMyWallet);

  const query = useQuery({
    queryKey: ["history", page, pageSize, typeFilter, statusFilter, search, address, onlyMyWallet],
    queryFn: () =>
      fetchHistory({
        page,
        pageSize,
        type: typeFilter,
        status: statusFilter,
        search,
        wallet: onlyMyWallet ? address : undefined
      }),
    enabled: Boolean(address) || !onlyMyWallet,
    refetchInterval: 15_000,
    staleTime: 10_000,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (query.data) {
      setCachedHistory(query.data.items, query.data.updatedAt);
    }
  }, [query.data, setCachedHistory]);

  const merged = useMemo(() => {
    const sources: TransactionHistoryItem[] = [
      ...history,
      ...cachedHistory
    ];

    const unique = new Map<string, TransactionHistoryItem>();
    sources.forEach((item) => {
      const key = item.hash || item.id;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });

    const all = Array.from(unique.values());
    const filtered = all.filter((item) => {
      if (onlyMyWallet && address && item.wallet && item.wallet.toLowerCase() !== address.toLowerCase()) {
        return false;
      }
      if (typeFilter !== "All" && item.type !== typeFilter) return false;
      if (statusFilter !== "All" && item.status !== statusFilter) return false;
      if (search) {
        const needle = search.toLowerCase();
        const haystack = `${item.type} ${item.tokenIn} ${item.tokenOut} ${item.hash || ""}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    return filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [address, cachedHistory, history, onlyMyWallet, search, statusFilter, typeFilter]);

  const total = merged.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = merged.slice((page - 1) * pageSize, page * pageSize);

  return {
    data: paged,
    total,
    totalPages,
    page,
    pageSize,
    search,
    typeFilter,
    statusFilter,
    onlyMyWallet,
    isLoading: query.isLoading,
    isError: query.isError,
    setPage,
    setPageSize,
    setSearch,
    setTypeFilter,
    setStatusFilter,
    setOnlyMyWallet
  };
}
