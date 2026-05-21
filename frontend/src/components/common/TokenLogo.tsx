import { memo } from "react";
import { Token } from "@/types/tokens";
import { cn } from "@/lib/utils";

const SIZE_MAP = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm"
};

type TokenLogoProps = {
  token?: Token;
  size?: keyof typeof SIZE_MAP;
};

function TokenLogo({ token, size = "md" }: TokenLogoProps) {
  if (!token) {
    return (
      <span
        className={cn(
          "grid place-items-center rounded-full border border-border bg-white/5 text-muted",
          SIZE_MAP[size]
        )}
        aria-hidden="true"
      >
        ?
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid place-items-center rounded-full border border-white/10 text-black",
        token.color,
        SIZE_MAP[size]
      )}
      aria-hidden="true"
    >
      {token.symbol.slice(0, 2)}
    </span>
  );
}

export default memo(TokenLogo);
