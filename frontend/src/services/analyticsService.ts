import { AnalyticsResponse } from "@/types/analytics";

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/analytics", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load analytics data");
  }
  return res.json();
}
