"use client";

import PageHeader from "@/components/common/PageHeader";
import HistoryFilters from "@/components/history/HistoryFilters";
import HistoryPagination from "@/components/history/HistoryPagination";
import TransactionHistoryTable from "@/components/history/TransactionHistoryTable";
import HistorySkeleton from "@/components/history/HistorySkeleton";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";

export default function HistoryPage() {
  const history = useTransactionHistory();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="History"
        title="Transaction history"
        subtitle="Track all swaps and liquidity events in one place."
      />
      <HistoryFilters
        search={history.search}
        typeFilter={history.typeFilter}
        statusFilter={history.statusFilter}
        onlyMyWallet={history.onlyMyWallet}
        onSearchChange={(value) => {
          history.setPage(1);
          history.setSearch(value);
        }}
        onTypeChange={(value) => {
          history.setPage(1);
          history.setTypeFilter(value);
        }}
        onStatusChange={(value) => {
          history.setPage(1);
          history.setStatusFilter(value);
        }}
        onWalletToggle={() => {
          history.setPage(1);
          history.setOnlyMyWallet(!history.onlyMyWallet);
        }}
      />

      {history.isLoading ? (
        <HistorySkeleton />
      ) : history.isError ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          Unable to load history right now. Please refresh.
        </div>
      ) : (
        <>
          <TransactionHistoryTable items={history.data} />
          <HistoryPagination
            page={history.page}
            totalPages={history.totalPages}
            onPageChange={history.setPage}
          />
        </>
      )}
    </div>
  );
}
