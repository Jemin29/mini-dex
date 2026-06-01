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

export type AddLiquidityParams = {
  router: string;
  tokenA: string;
  tokenB: string;
  amountADesired: string;
  amountBDesired: string;
  amountAMin: string;
  amountBMin: string;
  to: string;
  deadline: number;
  decimalsA: number;
  decimalsB: number;
};

export async function addLiquidity(params: AddLiquidityParams, signer: Signer) {
  const router = new Contract(params.router, routerAbi, signer);
  const amountADesired = parseUnits(params.amountADesired, params.decimalsA);
  const amountBDesired = parseUnits(params.amountBDesired, params.decimalsB);
  const amountAMin = parseUnits(params.amountAMin, params.decimalsA);
  const amountBMin = parseUnits(params.amountBMin, params.decimalsB);
  return router.addLiquidity(
    params.tokenA,
    params.tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    params.to,
    params.deadline
  );
}

export type RemoveLiquidityParams = {
  router: string;
  tokenA: string;
  tokenB: string;
  liquidity: string;
  amountAMin: string;
  amountBMin: string;
  to: string;
  deadline: number;
  decimalsA: number;
  decimalsB: number;
  lpDecimals: number;
};

export async function removeLiquidity(params: RemoveLiquidityParams, signer: Signer) {
  const router = new Contract(params.router, routerAbi, signer);
  const liquidity = parseUnits(params.liquidity, params.lpDecimals);
  const amountAMin = parseUnits(params.amountAMin, params.decimalsA);
  const amountBMin = parseUnits(params.amountBMin, params.decimalsB);
  return router.removeLiquidity(
    params.tokenA,
    params.tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    params.to,
    params.deadline
  );
}
