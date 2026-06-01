import { cacheGetOrSet } from "@/cache/cache";
import { tokens } from "@/data/store";

export async function listTokens() {
  return cacheGetOrSet("tokens:all", 60, async () => tokens);
}
