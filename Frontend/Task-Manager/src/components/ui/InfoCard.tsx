import { type FC, type ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const InfoCard: FC<InfoCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 md:w-2 h-3 md:h-5 ${color} rounded-full`} />

      <div className="flex items-center gap-2">
        <div className="text-white text-xl">{icon}</div>

        <p className="text-xs md:text-[14px] text-gray-500">
          <span className="text-sm md:text-[15px] text-white font-semibold">
            {value}
          </span>{" "}
          {label}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
