import moment from "moment";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import {
  LuPaperclip,
  LuCalendar,
  LuClock,
  LuTriangleAlert,
  LuCircleCheck,
} from "react-icons/lu";

interface TaskCardProps {
  title: string;
  description: string;
  priority: string;
  status: string;
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: string[]; // Array of profile image URLs
  attachmentCount: number;
  completedTodoCount: number;
  todoChecklist: { text: string; completed: boolean }[];
  onClick: () => void;
}

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}: TaskCardProps) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-blue-500/10";
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-500/30 shadow-green-500/10";
      default:
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-yellow-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-emerald-500/10";
      case "Medium":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-amber-500/10";
      default:
        return "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-rose-500/10";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "In Progress":
        return <LuClock className="w-3 h-3" />;
      case "Completed":
        return <LuCircleCheck className="w-3 h-3" />;
      default:
        return <LuTriangleAlert className="w-3 h-3" />;
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case "High":
        return <LuTriangleAlert className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const isOverdue = () => {
    if (!dueDate || status === "Completed") return false;
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = () => {
    if (!dueDate || status === "Completed") return false;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const getBorderColor = () => {
    if (isOverdue()) return "border-red-500/60";
    if (isDueSoon()) return "border-orange-500/60";
    switch (status) {
      case "In Progress":
        return "border-blue-400/60";
      case "Completed":
        return "border-green-500/60";
      default:
        return "border-[#4C35A0]/30";
    }
  };

  const getGlowEffect = () => {
    if (isOverdue()) return "shadow-red-500/20 hover:shadow-red-500/30";
    if (isDueSoon()) return "shadow-orange-500/20 hover:shadow-orange-500/30";
    switch (status) {
      case "In Progress":
        return "shadow-blue-500/20 hover:shadow-blue-500/30";
      case "Completed":
        return "shadow-green-500/20 hover:shadow-green-500/30";
      default:
        return "shadow-purple-500/10 hover:shadow-purple-500/20";
    }
  };

  return (
    <div
      className={`relative overflow-hidden cursor-pointer p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl 
      bg-gradient-to-br from-[#23235b]/80 to-[#2a1b5d]/90 backdrop-blur-md border-2 ${getBorderColor()} ${getGlowEffect()}
      rounded-xl group hover:-translate-y-1`}
      onClick={onClick}>
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

      {/* Overdue indicator */}
      {isOverdue() && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-red-500/50 shadow-lg"></div>
      )}

      {/* Status and Priority Tags */}
      <div className="relative flex flex-wrap items-center gap-2 mb-3">
        <div
          className={`text-[10px] sm:text-xs font-medium ${getStatusTagColor()} px-2 sm:px-3 py-1 rounded-full 
          flex items-center gap-1 shadow-sm`}>
          {getStatusIcon()}
          {status}
        </div>
        <div
          className={`text-[10px] sm:text-xs font-medium ${getPriorityTagColor()} px-2 sm:px-3 py-1 rounded-full 
          flex items-center gap-1 shadow-sm`}>
          {getPriorityIcon()}
          {priority} Priority
        </div>
        {isOverdue() && (
          <div className="text-[10px] sm:text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 px-2 sm:px-3 py-1 rounded-full animate-pulse">
            Overdue
          </div>
        )}
        {isDueSoon() && !isOverdue() && (
          <div className="text-[10px] sm:text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 sm:px-3 py-1 rounded-full">
            Due Soon
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`relative pl-3 sm:pl-4 border-l-3 transition-colors duration-300 ${
          isOverdue()
            ? "border-red-500"
            : status === "In Progress"
            ? "border-blue-500"
            : status === "Completed"
            ? "border-green-500"
            : "border-yellow-500"
        }`}>
        <h3 className="text-sm sm:text-[0.9375rem] font-semibold text-gray-100 line-clamp-2 mb-1.5 group-hover:text-white transition-colors duration-200">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
          {description}
        </p>

        {/* Task Progress Info */}
        <div className="flex items-center justify-between mt-3 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-300 font-medium">Progress:</span>
            <span className="text-xs font-semibold text-gray-100">
              {completedTodoCount} / {todoChecklist.length || 0}
            </span>
            <span className="text-xs text-gray-400">tasks</span>
          </div>
          <span className="text-xs font-semibold text-blue-300">
            {Math.round(progress)}%
          </span>
        </div>

        <Progress progress={progress} status={status} />
      </div>

      {/* Date Information */}
      <div className="relative mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <LuCalendar className="w-3 h-3 text-gray-500" />
            <div>
              <p className="text-[10px] text-gray-500 font-medium">Start</p>
              <p className="text-xs font-medium text-gray-200">
                {moment(createdAt).format("MMM DD")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LuCalendar
              className={`w-3 h-3 ${
                isOverdue()
                  ? "text-red-400"
                  : isDueSoon()
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
            />
            <div>
              <p className="text-[10px] text-gray-500 font-medium">Due</p>
              <p
                className={`text-xs font-medium ${
                  isOverdue()
                    ? "text-red-300"
                    : isDueSoon()
                    ? "text-orange-300"
                    : "text-gray-200"
                }`}>
                {moment(dueDate).format("MMM DD")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Avatars and Attachments */}
      <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
        <AvatarGroup avatars={assignedTo || []} maxVisible={3} />
        <div className="flex items-center gap-2">
          {attachmentCount > 0 && (
            <div
              className="flex items-center gap-1 sm:gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg shadow-md transition-all duration-200 cursor-pointer group/attachment"
              title={`${attachmentCount} attachment${
                attachmentCount > 1 ? "s" : ""
              }`}>
              <LuPaperclip className="text-blue-300 text-sm sm:text-base group-hover/attachment:scale-110 transition-transform duration-200" />
              <span className="text-xs text-blue-300 font-medium">
                {attachmentCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Completion indicator for completed tasks */}
      {status === "Completed" && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-green-500/30 shadow-lg">
          <LuCircleCheck className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default TaskCard;
