import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface BarChartData {
  priority: string;
  count: number;
}

interface CustomBarChartProps {
  data: BarChartData[];
}

const CustomBarChart = ({ data }: CustomBarChartProps) => {
  // Function to alternate colors
  const getBarColor = (entry: BarChartData) => {
    switch (entry?.priority) {
      case "Low":
        return "#00BC7D";

      case "Medium":
        return "#FE9900";

      case "High":
        return "#FF1F57";

      default:
        return "#00BC7D";
    }
  };

  return (
    <div className="mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
          <Tooltip
            content={<CustomTooltip />} // Now works for both Bar and Pie
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="count" fill="#FF8042" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
