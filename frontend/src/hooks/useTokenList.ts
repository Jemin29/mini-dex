import { Token } from "@/types/tokens";

const TOKENS: Token[] = [
  {
    symbol: "mA",
    name: "Mock Token A",
    address: "0x0000000000000000000000000000000000000001",
    decimals: 18,
    color: "bg-emerald-400"
  },
  {
    symbol: "mB",
    name: "Mock Token B",
    address: "0x0000000000000000000000000000000000000002",
    decimals: 18,
    color: "bg-sky-400"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x0000000000000000000000000000000000000003",
    decimals: 6,
    color: "bg-indigo-400"
  }
];

export function useTokenList() {
  return TOKENS;
}
