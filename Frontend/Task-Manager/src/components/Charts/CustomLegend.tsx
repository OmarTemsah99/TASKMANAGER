import type { LegendProps } from "recharts";

const CustomLegend = ({ payload }: LegendProps) => {
  if (!payload || !payload.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
      {payload.map((entry, index) => (
        <div
          key={`legend-item-${index}`}
          className="flex items-center space-x-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }}></span>
          <span className="text-sm text-gray-300 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
