export const env = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
  routerAddress: process.env.NEXT_PUBLIC_ROUTER_ADDRESS || "",
  poolAddress: process.env.NEXT_PUBLIC_POOL_ADDRESS || ""
};

export function assertEnv() {
  if (!env.routerAddress) {
    throw new Error("Missing NEXT_PUBLIC_ROUTER_ADDRESS");
  }
  if (!env.poolAddress) {
    throw new Error("Missing NEXT_PUBLIC_POOL_ADDRESS");
  }
}
