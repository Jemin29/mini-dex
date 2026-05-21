import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { sepolia } from "wagmi/chains";
import { getRpcUrl } from "@/lib/rpc";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Mini DEX",
  projectId,
  chains: [sepolia],
  ssr: true,
  multiInjectedProviderDiscovery: true,
  transports: {
    [sepolia.id]: http(getRpcUrl())
  }
});
