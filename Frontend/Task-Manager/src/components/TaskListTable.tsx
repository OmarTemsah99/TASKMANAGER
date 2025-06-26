import moment from "moment";

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  createdAt?: string;
}

interface TaskListTableProps {
  tableData: Task[];
}

const TaskListTable = ({ tableData }: TaskListTableProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      case "Medium":
        return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
      case "Low":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  // Mobile card view for small screens
  const MobileTaskCard = ({ task }: { task: Task }) => (
    <div className="task-card-mobile">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-medium text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadgeColor(
            task.status
          )}`}>
          {task.status}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(
            task.priority
          )}`}>
          {task.priority}
        </span>
        <span className="text-gray-400 text-xs">
          {task.createdAt
            ? moment(task.createdAt).format("MMM D, YYYY")
            : "N/A"}
        </span>
      </div>
    </div>
  );

  if (tableData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No recent tasks found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="block sm:hidden mt-4">
        {tableData.map((task) => (
          <MobileTaskCard key={task._id} task={task} />
        ))}
      </div>

      {/* Desktop/Tablet View - Table */}
      <div className="hidden sm:block table-dark mt-4">
        <table className="min-w-full">
          <thead className="table-header">
            <tr>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-white">
                Task Name
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-white">
                Status
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-white">
                Priority
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-medium text-white hidden md:table-cell">
                Created On
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((task) => (
              <tr key={task._id} className="table-row">
                <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-200 font-medium">
                  <div className="line-clamp-2 text-xs sm:text-sm">
                    {task.title}
                  </div>
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-200">
                  <span
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeColor(
                      task.status
                    )}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-200">
                  <span
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full inline-block ${getPriorityBadgeColor(
                      task.priority
                    )}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-200 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                  {task.createdAt
                    ? moment(task.createdAt).format("Do MMM YYYY")
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskListTable;
