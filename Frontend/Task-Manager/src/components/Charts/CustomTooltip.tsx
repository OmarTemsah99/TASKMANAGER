import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="card-dark p-2 border border-[#4C35A0]/30 shadow-xl">
        <p className="text-xs font-semibold text-white mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-300">
          Count:{" "}
          <span className="text-sm font-medium text-white">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
