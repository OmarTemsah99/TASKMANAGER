import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropdown from "../../components/ui/SelectDropdown";
import SelectUsers from "../../components/ui/SelectUsers";
import TodoListInput from "../../components/ui/TodoListInput";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const clearData = () => {
    // Reset form
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create Task
  const handleCreateTask = async () => {};

  // Update Task
  const handleUpdateTask = async () => {};

  const handleSubmit = async () => {};

  // get Task info by ID
  const getTaskDetailsByID = async () => {};

  // Delete Task
  const handleDeleteTask = async () => {};

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium text-white">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-red-300 bg-gradient-to-r from-red-800/20 to-red-700/20 rounded px-3 py-2 border border-red-600/30 hover:border-red-500/50 hover:bg-gradient-to-r hover:from-red-700/30 hover:to-red-600/30 cursor-pointer transition-all duration-200 backdrop-blur-sm shadow-lg shadow-red-500/10"
                  onClick={() => setOpenDeleteAlert(true)}>
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="form-label">Task Title</label>

              <input
                placeholder="Enter task title"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="form-label">Description</label>

              <textarea
                placeholder="Enter task description"
                className="form-input resize-none"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="form-label">Priority</label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="form-label">Due Date</label>

                <input
                  placeholder="Select due date"
                  className="form-input cursor-pointer"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                  style={{
                    colorScheme: "dark",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="form-label">Assign To</label>

                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label">TODO Checklist</label>

              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value: string[]) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
