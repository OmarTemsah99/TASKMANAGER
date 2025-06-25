import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/ui/TaskCard";

interface TabItem {
  label: string;
  count: number;
}

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

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async (filterStatus: string) => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};

      const statusArray: TabItem[] = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleClick = (taskData: { _id: string }) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  // download task report
  const handleDownloadReport = async () => {};

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-medium text-nowrap">
              My Tasks
            </h2>
            <button
              className="flex lg:hidden download-btn text-xs sm:text-sm text-nowrap"
              onClick={handleDownloadReport}>
              <LuFileSpreadsheet className="text-base sm:text-lg" />
              <span className="hidden xs:inline ml-1">Download Report</span>
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex flex-col xs:flex-row xs:items-center gap-3">
              <div className="overflow-x-auto pb-1 scrollbar-hide">
                {" "}
                {/* Scrollable tabs */}
                <TaskStatusTabs
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                />
              </div>
              <button
                className="hidden lg:flex download-btn text-nowrap"
                onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
          {allTasks?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress ?? 0}
              createdAt={item.createdAt ?? ""}
              dueDate={item.dueDate ?? ""}
              assignedTo={item.assignedTo?.map((u) => u.profileImageUrl) || []}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => handleClick(item)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
