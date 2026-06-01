import { cacheGetOrSet } from "@/cache/cache";
import { transactions } from "@/data/store";

export async function getUserActivity(wallet: string) {
  return cacheGetOrSet(`user:${wallet}:activity`, 15, async () => {
    return transactions.filter((tx) => tx.wallet.toLowerCase() === wallet.toLowerCase());
  });
}
