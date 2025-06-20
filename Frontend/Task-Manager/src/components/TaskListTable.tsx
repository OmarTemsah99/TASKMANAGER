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

  return (
    <div className="table-dark mt-4">
      <table className="min-w-full">
        <thead className="table-header">
          <tr>
            <th className="py-4 px-6 text-left text-sm font-medium text-white">
              Task Name
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium text-white">
              Status
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium text-white">
              Priority
            </th>
            <th className="py-4 px-6 text-left text-sm font-medium text-white hidden md:table-cell">
              Created On
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="table-row">
              <td className="table-cell font-medium">
                <div className="line-clamp-1 overflow-hidden">{task.title}</div>
              </td>
              <td className="table-cell">
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full inline-block ${getStatusBadgeColor(
                    task.status
                  )}`}>
                  {task.status}
                </span>
              </td>
              <td className="table-cell">
                <span
                  className={`px-3 py-1.5 text-xs font-medium rounded-full inline-block ${getPriorityBadgeColor(
                    task.priority
                  )}`}>
                  {task.priority}
                </span>
              </td>
              <td className="table-cell text-nowrap md:table-cell">
                {task.createdAt
                  ? moment(task.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
