import routerAbi from "@/lib/abis/DexRouter.json";
import poolAbi from "@/lib/abis/LiquidityPool.json";
import erc20Abi from "@/lib/abis/ERC20.json";
import { env } from "@/lib/env";

export const dexContracts = {
  router: {
    address: env.routerAddress as `0x${string}`,
    abi: routerAbi
  },
  pool: {
    address: env.poolAddress as `0x${string}`,
    abi: poolAbi
  },
  erc20: {
    abi: erc20Abi
  }
};
