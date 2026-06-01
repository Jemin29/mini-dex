export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
  rpcUrls: (process.env.NEXT_PUBLIC_RPC_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  routerAddress: process.env.NEXT_PUBLIC_ROUTER_ADDRESS || "",
  poolAddress: process.env.NEXT_PUBLIC_POOL_ADDRESS || "",
  analyticsScriptUrl: process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL || "",
  analyticsSiteId: process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID || ""
};

export function assertEnv() {
  if (!env.routerAddress) {
    throw new Error("Missing NEXT_PUBLIC_ROUTER_ADDRESS");
  }
  if (!env.poolAddress) {
    throw new Error("Missing NEXT_PUBLIC_POOL_ADDRESS");
  }
}
