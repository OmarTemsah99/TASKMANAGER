import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    // Try to get status or priority from payload or label
    const data = payload[0].payload || {};
    const status = data.status || label;
    const priority = data.priority || label;
    const count = payload[0].value;
    return (
      <div className="card-dark p-2 border border-[#4C35A0]/30 shadow-xl">
        {status && (
          <p className="text-xs font-semibold text-white mb-1">
            Status: <span className="font-normal">{status}</span>
          </p>
        )}
        {priority && !status && (
          <p className="text-xs font-semibold text-white mb-1">
            Priority: <span className="font-normal">{priority}</span>
          </p>
        )}
        <p className="text-sm text-gray-300">
          Count: <span className="text-sm font-medium text-white">{count}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
