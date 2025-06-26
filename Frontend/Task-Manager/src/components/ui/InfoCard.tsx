import { type FC, type ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string; // Ex: 'bg-cyan-500'
}

const InfoCard: FC<InfoCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="rounded-xl p-4 sm:p-5 backdrop-blur-md bg-white/5 border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.015]">
      <div className="flex items-center gap-4">
        {/* Icon Indicator */}
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-10 ${color} rounded-full`} />
          <div className="text-2xl text-white">{icon}</div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-white text-lg sm:text-xl font-semibold truncate">
            {value}
          </div>
          <p className="text-xs sm:text-sm text-gray-300 mt-0.5 truncate">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
