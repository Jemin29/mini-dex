import { eventBus } from "@/events/eventBus";
import { addTransaction } from "@/services/transactionService";
import type { Transaction } from "@/types";

export function startIndexer() {
  setInterval(() => {
    const tx: Transaction = {
      id: `${Date.now()}`,
      hash: "0x" + Math.random().toString(16).slice(2, 10),
      type: Math.random() > 0.5 ? "Swap" : "Add",
      tokenIn: "ETH",
      tokenOut: "USDC",
      amountIn: 1.25,
      amountOut: 3820.5,
      wallet: "0xwallet",
      status: "confirmed",
      timestamp: Date.now()
    };

    addTransaction(tx);
    eventBus.emit("tx", tx);
  }, 15_000);
}
