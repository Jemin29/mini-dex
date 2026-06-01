"use client";

import { useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";

type AnalyticsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AnalyticsError({ error, reset }: AnalyticsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="DEX analytics"
        subtitle="We hit a snag while loading analytics."
      />
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
        Something went wrong. Please try again.
        <button
          onClick={reset}
          className="mt-3 inline-flex items-center rounded-md border border-red-500/40 px-3 py-1 text-xs text-red-100 hover:bg-red-500/10"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
