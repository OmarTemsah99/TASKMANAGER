import type { LegendProps } from "recharts";

const CustomLegend = ({ payload }: LegendProps) => {
  if (!payload || !payload.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-5 px-2">
      {payload.map((entry, index) => (
        <div
          key={`legend-item-${index}`}
          className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <span
            className="w-3.5 h-3.5 rounded-full shadow-sm"
            style={{ backgroundColor: entry.color }}></span>
          <span className="truncate max-w-[100px]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
