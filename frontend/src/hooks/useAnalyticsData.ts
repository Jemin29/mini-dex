"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/services/analyticsService";

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 15_000,
    staleTime: 10_000,
    refetchOnWindowFocus: false
  });
}
