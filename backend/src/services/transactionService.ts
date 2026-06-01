import { cacheGetOrSet } from "@/cache/cache";
import { transactions } from "@/data/store";
import type { Transaction } from "@/types";

export async function listTransactions() {
  return cacheGetOrSet("tx:all", 10, async () => transactions);
}

export function addTransaction(tx: Transaction) {
  transactions.unshift(tx);
  if (transactions.length > 1000) {
    transactions.pop();
  }
}
