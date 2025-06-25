import type { Dispatch, SetStateAction } from "react";

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
  return (
    <div className="my-1 sm:my-2">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-full mx-1
              ${
                activeTab === tab.label
                  ? "text-blue-300 shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-800/40 to-purple-600/40"
                  : "text-gray-400 hover:text-gray-300 bg-gray-700/60 hover:bg-gray-700/80"
              } cursor-pointer whitespace-nowrap`}
            onClick={() => setActiveTab(tab.label)}>
            <div className="flex items-center">
              <span>{tab.label}</span>
              <span
                className={`text-[10px] sm:text-xs ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full transition-all duration-300
                  ${
                    activeTab === tab.label
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                      : "bg-gray-700 text-gray-300"
                  }`}>
                {tab.count}
              </span>
            </div>
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusTabs;
