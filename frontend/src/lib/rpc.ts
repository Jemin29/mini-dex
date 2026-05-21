import { env } from "@/lib/env";

export function getRpcUrl() {
  return env.rpcUrl || "https://rpc.ankr.com/eth_sepolia";
}
