import { type FC, type ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const InfoCard: FC<InfoCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-gradient-to-br from-[#2A1B5D]/60 to-[#3D2A7D]/40 p-3 sm:p-4 rounded-xl border border-[#4C35A0]/30 backdrop-blur-sm hover:from-[#2A1B5D]/80 hover:to-[#3D2A7D]/60 transition-all duration-200">
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
