"use client";

import { Button } from "@/components/ui/button";

type HistoryPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function HistoryPagination({ page, totalPages, onPageChange }: HistoryPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted">Page {page} of {totalPages}</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
