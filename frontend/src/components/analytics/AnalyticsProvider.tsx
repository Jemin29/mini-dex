import Script from "next/script";
import { env } from "@/lib/env";

export default function AnalyticsProvider() {
  if (!env.analyticsScriptUrl || !env.analyticsSiteId) {
    return null;
  }

  return (
    <Script
      src={env.analyticsScriptUrl}
      data-website-id={env.analyticsSiteId}
      strategy="afterInteractive"
    />
  );
}
