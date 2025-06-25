import moment from "moment";
import Progress from "../Progress";
import AvatarGroup from "../AvatarGroup";
import { LuPaperclip } from "react-icons/lu";

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
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      default:
        return "bg-rose-500/20 text-rose-300 border border-rose-500/30";
    }
  };

  return (
    <div
      className="card-dark cursor-pointer p-3 sm:p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl shadow-blue-500/20 bg-gradient-to-br from-[#23235b]/80 to-[#2a1b5d]/90 backdrop-blur-md border border-[#4C35A0]/30 hover:border-blue-400/60 group"
      onClick={onClick}>
      <div className="flex flex-wrap items-center gap-2">
        <div
          className={`text-[10px] sm:text-xs font-medium ${getStatusTagColor()} px-2 sm:px-3 py-1 rounded-full`}>
          {status}
        </div>
        <div
          className={`text-[10px] sm:text-xs font-medium ${getPriorityTagColor()} px-2 sm:px-3 py-1 rounded-full`}>
          {priority} Priority
        </div>
      </div>
      <div
        className={`mt-3 sm:mt-4 pl-2 sm:pl-3 border-l-2 ${
          status === "In Progress"
            ? "border-blue-500"
            : status === "Completed"
            ? "border-green-500"
            : "border-yellow-500"
        }`}>
        <p className="text-sm sm:text-[0.9375rem] font-medium text-gray-100 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-1 sm:mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>
        <p className="text-xs text-gray-300 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-100">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>
      <div className="mt-3 sm:mt-4">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-4">
          <div className="w-full xs:w-auto">
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-xs font-medium text-gray-200">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div className="w-full xs:w-auto">
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-xs font-medium text-gray-200">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} maxVisible={3} />
          {attachmentCount > 0 && (
            <div
              className="flex items-center gap-1 sm:gap-2 bg-blue-500/20 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg shadow-md hover:bg-blue-500/40 transition-colors duration-200 cursor-pointer"
              title="View attachments">
              <LuPaperclip className="text-blue-300 text-sm sm:text-base" />
              <span className="text-xs text-blue-300">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
