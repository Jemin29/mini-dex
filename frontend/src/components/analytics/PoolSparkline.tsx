import { memo, useMemo } from "react";

type PoolSparklineProps = {
  values?: number[];
};

const defaultValues = [4, 6, 5, 8, 7, 9, 6, 10, 8];

function PoolSparkline({ values = defaultValues }: PoolSparklineProps) {
  const points = useMemo(() => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 120;
        const y = 36 - ((value - min) / (max - min || 1)) * 32;
        return `${x},${y}`;
      })
      .join(" ");
  }, [values]);

  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <polyline
        points={points}
        stroke="#22f7d4"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default memo(PoolSparkline);
