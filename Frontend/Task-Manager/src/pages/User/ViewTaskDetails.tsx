import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import AvatarGroup from "../../components/AvatarGroup";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  progress?: number;
  createdAt?: string;
  dueDate?: string;
  assignedTo: {
    profileImageUrl: string;
  }[];
  attachments?: string[];
  completedTodoCount?: number;
  todoChecklist: { text: string; completed: boolean }[];
}

const ViewTaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "status-in-progress";
      case "Completed":
        return "status-completed";
      default:
        return "status-pending";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  // get task info by ID
  const getTaskDetailsByID = async (taskId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle todo check
  const updateTodoChecklist = async (index: number) => {
    if (!task || !id) return;

    const todoChecklist = [...task.todoChecklist];
    const originalState = todoChecklist[index].completed;

    // Optimistically update the UI
    todoChecklist[index].completed = !todoChecklist[index].completed;
    setTask({ ...task, todoChecklist });

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist }
      );

      if (response.data?.task) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error updating todo checklist:", error);
      // Revert the optimistic update on error
      todoChecklist[index].completed = originalState;
      setTask({ ...task, todoChecklist });
    }
  };

  // Handle attachment link click
  const handleLinkClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID(id);
    }
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="spinner w-8 h-8"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-white mb-2">
              Task Not Found
            </h2>
            <p className="text-gray-300">
              The requested task could not be found.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="p-6">
        <div className="space-y-6">
          {/* Task Progress - Full Width */}
          {task.progress !== undefined && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title">Task Progress</h3>
                <span className="text-white font-medium text-lg">
                  {task.progress}%
                </span>
              </div>
              <div className="w-full bg-[#1E1145] rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/30"
                  style={{ width: `${task.progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Main Task Details */}
          <div className="space-y-6">
            {/* Task Header */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-semibold text-white mb-2 line-clamp-2">
                    {task.title}
                  </h1>
                  <p className="text-sm text-gray-300">
                    Created {moment(task.createdAt).fromNow()}
                  </p>
                </div>

                <div
                  className={`${getStatusTagColor(
                    task.status
                  )} px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0`}>
                  {task.status}
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Description</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="info-card-mobile">
                <InfoBox
                  label="Priority"
                  value={task.priority}
                  className={getPriorityColor(task.priority)}
                />
              </div>

              <div className="info-card-mobile">
                <InfoBox
                  label="Due Date"
                  value={
                    task.dueDate
                      ? moment(task.dueDate).format("MMM Do, YYYY")
                      : "No due date"
                  }
                />
              </div>

              <div className="info-card-mobile">
                <label className="input-label text-xs">Assigned To</label>
                <div className="mt-2">
                  <AvatarGroup
                    avatars={
                      task.assignedTo?.map((item) => item?.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
            </div>

            {/* Additional Task Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {task.completedTodoCount !== undefined && (
                <div className="info-card-mobile">
                  <label className="input-label text-xs">Completed Todos</label>
                  <p className="text-sm text-gray-200 mt-1">
                    {task.completedTodoCount}
                  </p>
                </div>
              )}
            </div>

            {/* Todo Checklist */}
            {task.todoChecklist && task.todoChecklist.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Todo Checklist</h3>
                  <p className="card-subtitle">
                    {task.todoChecklist.filter((item) => item.completed).length}{" "}
                    of {task.todoChecklist.length} completed
                  </p>
                </div>

                <div className="space-y-2">
                  {task.todoChecklist.map((item, index) => (
                    <TodoCheckList
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Attachments</h3>
                  <p className="card-subtitle">
                    {task.attachments.length} file(s)
                  </p>
                </div>

                <div className="space-y-3">
                  {task.attachments.map((link, index) => (
                    <Attachment
                      key={`attachment_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

interface InfoBoxProps {
  label: string;
  value: string;
  className?: string;
}

const InfoBox = ({ label, value, className }: InfoBoxProps) => {
  return (
    <div>
      <label className="input-label text-xs">{label}</label>
      <div
        className={`mt-2 ${
          className
            ? `${className} px-2 py-1 rounded-full text-xs font-medium inline-block`
            : ""
        }`}>
        <p
          className={`text-sm font-medium ${className ? "" : "text-gray-200"}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

interface TodoCheckListProps {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}

const TodoCheckList = ({ text, isChecked, onChange }: TodoCheckListProps) => {
  return (
    <div className="task-card-mobile">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className="w-4 h-4 mt-0.5 text-primary-500 bg-[#1E1145] border-[#4C35A0] rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
        />

        <p
          className={`text-sm flex-1 transition-all duration-200 ${
            isChecked ? "text-gray-400 line-through" : "text-gray-200"
          }`}>
          {text}
        </p>
      </div>
    </div>
  );
};

interface AttachmentProps {
  link: string;
  index: number;
  onClick: () => void;
}

const Attachment = ({ link, index, onClick }: AttachmentProps) => {
  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split("/").pop() || url;
    } catch {
      return url;
    }
  };

  return (
    <div className="task-card-mobile cursor-pointer group" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs text-blue-400 font-semibold bg-blue-500/20 px-2 py-1 rounded flex-shrink-0">
            {index < 9 ? `0${index + 1}` : index + 1}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate group-hover:text-blue-300 transition-colors duration-200">
              {getFileName(link)}
            </p>
            <p className="text-xs text-gray-400 truncate mt-1">{link}</p>
          </div>
        </div>

        <LuSquareArrowOutUpRight className="text-gray-400 group-hover:text-blue-400 transition-colors duration-200 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
};
