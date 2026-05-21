import { Contract, Signer, parseUnits } from "ethers";
import routerAbi from "@/lib/abis/DexRouter.json";
import erc20Abi from "@/lib/abis/ERC20.json";

export type SwapParams = {
  router: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOutMin: string;
  to: string;
  deadline: number;
  decimalsIn: number;
  decimalsOut: number;
};

export async function approveToken(
  token: string,
  spender: string,
  amount: string,
  decimals: number,
  signer: Signer
) {
  const erc20 = new Contract(token, erc20Abi, signer);
  return erc20.approve(spender, parseUnits(amount, decimals));
}

export async function swapExactTokens(params: SwapParams, signer: Signer) {
  const router = new Contract(params.router, routerAbi, signer);
  const amountIn = parseUnits(params.amountIn, params.decimalsIn);
  const amountOutMin = parseUnits(params.amountOutMin, params.decimalsOut);
  return router.swapExactTokensForTokens(
    params.tokenIn,
    params.tokenOut,
    amountIn,
    amountOutMin,
    params.to,
    params.deadline
  );
}
