const COLOR_PALETTE = [
  "#8B5CF6",
  "#22C55E",
  "#F59E0B",
  "#0EA5E9",
  "#EC4899",
  "#F43F5E",
  "#14B8A6",
  "#6366F1",
  "#84CC16",
  "#06B6D4",
  "#A855F7",
  "#10B981",
  "#F97316",
  "#3B82F6",
  "#D946EF",
  "#EF4444",
  "#0D9488",
  "#7C3AED",
  "#65A30D",
  "#0284C7",
  "#C026D3",
  "#DC2626",
  "#059669",
  "#2563EB",
  "#9333EA",
  "#EA580C",
  "#0891B2",
  "#4F46E5",
  "#16A34A",
  "#CA8A04",
];

export function getColor(topic: string): string {
  let hash = 0;

  for (let i = 0; i < topic.length; i++) {
    hash = hash * 31 + topic.charCodeAt(i);
  }

  // convert to unsigned 32 bit integer
  hash = hash >>> 0;

  return COLOR_PALETTE[hash % COLOR_PALETTE.length]!;
}
