import { env } from "@/lib/env";

export function getRpcUrls() {
  const urls = env.rpcUrl ? [env.rpcUrl] : env.rpcUrls;
  return urls.length ? urls : ["https://rpc.ankr.com/eth_sepolia"];
}

export function getRpcUrl() {
  return getRpcUrls()[0];
}
