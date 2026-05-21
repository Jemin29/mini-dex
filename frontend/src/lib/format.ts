export function formatNumber(value: number, decimals = 2) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatPct(value: number, decimals = 2) {
  return `${formatNumber(value, decimals)}%`;
}
