import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet, LuPlus, LuSearch, LuFilter } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import toast from "react-hot-toast";

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

const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const getAllTasks = async (filterStatus: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      const tasks = response.data?.tasks?.length > 0 ? response.data.tasks : [];
      setAllTasks(tasks);
      setFilteredTasks(tasks);

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
      console.error("Error fetching tasks: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced search and filter logic
  useEffect(() => {
    let filtered = allTasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply quick filters
    if (activeQuickFilter) {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      switch (activeQuickFilter) {
        case "high-priority":
          filtered = filtered.filter((task) => task.priority === "High");
          break;
        case "due-today":
          filtered = filtered.filter((task) => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate.toDateString() === today.toDateString();
          });
          break;
        case "overdue":
          filtered = filtered.filter((task) => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate < today && task.status !== "Completed";
          });
          break;
        case "assigned-to-me":
          // This would need user context - for now, just filter incomplete tasks
          filtered = filtered.filter((task) => task.status !== "Completed");
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          return (
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
          );
        case "dueDate":
          return (
            new Date(a.dueDate || 0).getTime() -
            new Date(b.dueDate || 0).getTime()
          );
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        default: // createdAt
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    setFilteredTasks(filtered);
  }, [allTasks, searchTerm, sortBy, activeQuickFilter]);

  const handleClick = (taskData: { _id: string }) => {
    navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
  };

  const handleQuickFilter = (filterType: string) => {
    if (activeQuickFilter === filterType) {
      // If clicking the same filter, deactivate it
      setActiveQuickFilter(null);
    } else {
      // Activate the new filter
      setActiveQuickFilter(filterType);
    }
  };

  const getActiveFilterLabel = () => {
    switch (activeQuickFilter) {
      case "high-priority":
        return "High Priority";
      case "due-today":
        return "Due Today";
      case "overdue":
        return "Overdue";
      case "assigned-to-me":
        return "Active Tasks";
      default:
        return "";
    }
  };

  const handleCreateTask = () => {
    navigate(`/admin/create-task`);
  };

  // download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.xlsx");
      document.body.appendChild(link);
      link.click();

      // Check parentNode is not null
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report: ", error);
      toast.error("Failed to download report. Please try again.");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        {/* Enhanced Header Section */}
        <div className="card-dark p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <LuFileSpreadsheet className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                  Task Management
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Manage and track your tasks efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="card-btn touch-friendly"
                onClick={handleCreateTask}>
                <LuPlus className="text-base" />
                <span className="hidden sm:inline">New Task</span>
              </button>
              <button
                className="card-btn touch-friendly"
                onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-base" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card-dark p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-base pl-10 text-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                className="card-btn touch-friendly"
                onClick={() => setShowFilters(!showFilters)}>
                <LuFilter className="text-base" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base text-sm min-w-[120px]">
                <option value="createdAt">Latest</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>

          {/* Collapsible Filter Section */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#4C35A0]/20">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-300 mr-2">
                  Quick filters:
                </span>
                <button
                  className={`text-xs ${
                    activeQuickFilter === "high-priority"
                      ? "card-btn-fill"
                      : "card-btn"
                  }`}
                  onClick={() => handleQuickFilter("high-priority")}>
                  High Priority
                </button>
                <button
                  className={`text-xs ${
                    activeQuickFilter === "due-today"
                      ? "card-btn-fill"
                      : "card-btn"
                  }`}
                  onClick={() => handleQuickFilter("due-today")}>
                  Due Today
                </button>
                <button
                  className={`text-xs ${
                    activeQuickFilter === "overdue"
                      ? "card-btn-fill"
                      : "card-btn"
                  }`}
                  onClick={() => handleQuickFilter("overdue")}>
                  Overdue
                </button>
                <button
                  className={`text-xs ${
                    activeQuickFilter === "assigned-to-me"
                      ? "card-btn-fill"
                      : "card-btn"
                  }`}
                  onClick={() => handleQuickFilter("assigned-to-me")}>
                  Active Tasks
                </button>
                {activeQuickFilter && (
                  <button
                    className="text-xs card-btn text-red-300 hover:text-red-200"
                    onClick={() => setActiveQuickFilter(null)}>
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Tabs */}
        {tabs?.[0]?.count > 0 && (
          <div className="mb-6">
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          </div>
        )}

        {/* Tasks Grid with Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner w-8 h-8"></div>
            <span className="ml-3 text-gray-300">Loading tasks...</span>
          </div>
        ) : (
          <div className="mobile-dashboard-grid">
            {filteredTasks?.length === 0 ? (
              <div className="col-span-full">
                <div className="card-dark p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LuFileSpreadsheet className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {searchTerm ? "No matching tasks found" : "No tasks found"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Get started by creating your first task"}
                  </p>
                  {!searchTerm && (
                    <button
                      className="button-gradient"
                      onClick={handleCreateTask}>
                      <LuPlus className="inline mr-2" />
                      Create First Task
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredTasks.map((item) => (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress ?? 0}
                  createdAt={item.createdAt ?? ""}
                  dueDate={item.dueDate ?? ""}
                  assignedTo={
                    item.assignedTo?.map((u) => u.profileImageUrl) || []
                  }
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item)}
                />
              ))
            )}
          </div>
        )}

        {/* Results Summary */}
        {filteredTasks.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Showing {filteredTasks.length} of {allTasks.length} tasks
              {searchTerm && ` matching "${searchTerm}"`}
              {activeQuickFilter && ` • ${getActiveFilterLabel()}`}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
