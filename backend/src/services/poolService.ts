import { cacheGetOrSet } from "@/cache/cache";
import { pools } from "@/data/store";

export async function listPools() {
  return cacheGetOrSet("pools:all", 30, async () => pools);
}
