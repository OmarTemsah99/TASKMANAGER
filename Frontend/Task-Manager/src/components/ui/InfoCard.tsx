import { type FC, type ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const InfoCard: FC<InfoCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="info-card-mobile">
      {/* Mobile Layout: Vertical Stack */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
        {/* Icon and Color Indicator */}
        <div className="flex items-center gap-2 xs:gap-3">
          <div
            className={`w-1 xs:w-2 h-8 xs:h-10 sm:h-12 ${color} rounded-full`}
          />
          <div className="text-white text-lg xs:text-xl sm:text-2xl">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-white leading-tight">
            {value}
          </div>
          <p className="text-xs xs:text-sm text-gray-300 leading-tight mt-0.5">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
