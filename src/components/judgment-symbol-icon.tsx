import type { JudgmentSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";

const SYMBOL_COLORS: Record<JudgmentSymbol, string> = {
  "○": "#10b981",
  "△": "#fbbf24",
  "▲": "#fb923c",
  "□": "#94a3b8",
  "×": "#ef4444",
};

const STROKE_WIDTH = 2;
const OUTER_RADIUS = 21;
const INNER_CIRCLE_RADIUS = 8;
const INNER_TRIANGLE = "24,16 16,32 32,32";
const INNER_SQUARE = { x: 17, y: 17, size: 14 };
const INNER_X = { from: 17, to: 31 };

function InnerSymbol({ symbol, color }: { symbol: JudgmentSymbol; color: string }) {
  switch (symbol) {
    case "○":
      return (
        <circle
          cx="24"
          cy="24"
          r={INNER_CIRCLE_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
        />
      );
    case "△":
      return (
        <polygon
          points={INNER_TRIANGLE}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinejoin="round"
        />
      );
    case "▲":
      return <polygon points={INNER_TRIANGLE} fill={color} />;
    case "□":
      return (
        <rect
          x={INNER_SQUARE.x}
          y={INNER_SQUARE.y}
          width={INNER_SQUARE.size}
          height={INNER_SQUARE.size}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
        />
      );
    case "×":
      return (
        <>
          <line
            x1={INNER_X.from}
            y1={INNER_X.from}
            x2={INNER_X.to}
            y2={INNER_X.to}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
          <line
            x1={INNER_X.to}
            y1={INNER_X.from}
            x2={INNER_X.from}
            y2={INNER_X.to}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        </>
      );
  }
}

type Props = {
  symbol: JudgmentSymbol;
  size?: number;
  className?: string;
};

export function JudgmentSymbolIcon({ symbol, size = 44, className }: Props) {
  const color = SYMBOL_COLORS[symbol];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle
        cx="24"
        cy="24"
        r={OUTER_RADIUS}
        fill="white"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
      />
      <InnerSymbol symbol={symbol} color={color} />
    </svg>
  );
}
