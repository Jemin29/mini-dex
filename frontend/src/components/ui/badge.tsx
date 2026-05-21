import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground",
      className
    )}
    {...props}
  />
);

export { Badge };
