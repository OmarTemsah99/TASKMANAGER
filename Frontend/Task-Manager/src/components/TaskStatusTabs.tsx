import type { Dispatch, SetStateAction } from "react";
import {
  LuListTodo,
  LuClock,
  LuCircleCheck,
  LuTriangleAlert,
} from "react-icons/lu";

interface TabItem {
  label: string;
  count: number;
}

interface TaskStatusTabsProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const TaskStatusTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: TaskStatusTabsProps) => {
  const getTabIcon = (label: string) => {
    switch (label) {
      case "All":
        return <LuListTodo className="w-4 h-4" />;
      case "Pending":
        return <LuTriangleAlert className="w-4 h-4" />;
      case "In Progress":
        return <LuClock className="w-4 h-4" />;
      case "Completed":
        return <LuCircleCheck className="w-4 h-4" />;
      default:
        return <LuListTodo className="w-4 h-4" />;
    }
  };

  const getTabColor = (label: string, isActive: boolean) => {
    if (isActive) {
      switch (label) {
        case "All":
          return "text-indigo-300 bg-gradient-to-r from-indigo-800/50 to-purple-800/50 border-indigo-400/60 shadow-indigo-500/20";
        case "Pending":
          return "text-yellow-300 bg-gradient-to-r from-yellow-800/50 to-orange-800/50 border-yellow-400/60 shadow-yellow-500/20";
        case "In Progress":
          return "text-blue-300 bg-gradient-to-r from-blue-800/50 to-cyan-800/50 border-blue-400/60 shadow-blue-500/20";
        case "Completed":
          return "text-green-300 bg-gradient-to-r from-green-800/50 to-emerald-800/50 border-green-400/60 shadow-green-500/20";
        default:
          return "text-blue-300 bg-gradient-to-r from-blue-800/40 to-purple-600/40 border-blue-400/60 shadow-blue-500/20";
      }
    } else {
      return "text-gray-400 hover:text-gray-300 bg-gradient-to-r from-gray-800/40 to-gray-700/40 hover:from-gray-700/60 hover:to-gray-600/60 border-gray-600/30 hover:border-gray-500/50";
    }
  };

  const getCountBadgeColor = (label: string, isActive: boolean) => {
    if (isActive) {
      switch (label) {
        case "All":
          return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/30";
        case "Pending":
          return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/30";
        case "In Progress":
          return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30";
        case "Completed":
          return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30";
        default:
          return "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/30";
      }
    } else {
      return "bg-gray-700/80 text-gray-300 group-hover:bg-gray-600/80 group-hover:text-gray-200";
    }
  };

  const getActiveIndicatorColor = (label: string) => {
    switch (label) {
      case "All":
        return "bg-gradient-to-r from-indigo-500 to-purple-500";
      case "Pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-500";
    }
  };

  return (
    <div className="my-2 sm:my-3">
      <div className="flex overflow-visible scrollbar-hide gap-2 pb-2 py-1 justify-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              className={`group relative flex-shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium 
              transition-all duration-300 rounded-xl border backdrop-blur-sm
              ${getTabColor(tab.label, isActive)} 
              ${
                isActive
                  ? "shadow-lg transform scale-105"
                  : "hover:shadow-md hover:scale-102"
              } 
              cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1145]
              ${
                isActive ? "focus:ring-blue-400/50" : "focus:ring-gray-400/50"
              }`}
              onClick={() => setActiveTab(tab.label)}>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Tab Icon */}
                <span
                  className={`transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}>
                  {getTabIcon(tab.label)}
                </span>

                {/* Tab Label */}
                <span className="font-semibold">{tab.label}</span>

                {/* Count Badge */}
                <span
                  className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-bold 
                  transition-all duration-300 shadow-sm ${getCountBadgeColor(
                    tab.label,
                    isActive
                  )}
                  ${isActive ? "animate-pulse" : ""}`}>
                  {tab.count}
                </span>
              </div>

              {/* Active indicator bar */}
              {isActive && (
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full 
                ${getActiveIndicatorColor(
                  tab.label
                )} shadow-md animate-pulse`}></div>
              )}

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 
              ${
                isActive ? getActiveIndicatorColor(tab.label) : "bg-gray-400"
              }`}></div>

              {/* Active background glow */}
              {isActive && (
                <div
                  className={`absolute inset-0 rounded-xl opacity-10 ${getActiveIndicatorColor(
                    tab.label
                  )} animate-pulse`}></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile scroll indicator */}
      <div className="sm:hidden flex justify-center mt-2">
        <div className="flex gap-1">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 
              ${
                activeTab === tabs[index]?.label ? "bg-blue-400" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusTabs;
