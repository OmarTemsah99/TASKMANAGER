import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { PRIORITY_DATA } from "../../utils/data";
import SelectDropdown from "../../components/ui/SelectDropdown";
import SelectUsers from "../../components/ui/SelectUsers";
import TodoListInput from "../../components/ui/TodoListInput";
import AddAttachmentsInput from "../../components/ui/AddAttachmentsInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import type { User } from "../../types/user";
import moment from "moment";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import axios from "axios";

// --- Interfaces ---

interface TodoItem {
  text: string;
  completed: boolean;
}

interface Task {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignedTo: User[];
  todoChecklist: string[];
  attachments: string[];
}

interface FullTask extends Omit<Task, "todoChecklist"> {
  _id: string;
  todoChecklist: TodoItem[];
}

const defaultTaskData: Task = {
  title: "",
  description: "",
  priority: "Low",
  dueDate: "",
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
};

// --- Component ---

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState<Task>(defaultTaskData);
  const [currentTask, setCurrentTask] = useState<FullTask | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = <K extends keyof Task>(key: K, value: Task[K]) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => setTaskData(defaultTaskData);

  const createTask = async () => {
    setLoading(true);
    try {
      const formattedChecklist = taskData.todoChecklist.map((text) => ({
        text,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: formattedChecklist,
      });

      toast.success("Task Created Successfully");
      clearData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Create error:", error.response?.data?.message);
      } else {
        console.error("Unknown error:", (error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string) => {
    setLoading(true);
    try {
      const updatedChecklist = taskData.todoChecklist.map((text) => {
        const matched = currentTask?.todoChecklist.find((t) => t.text === text);
        return {
          text,
          completed: matched?.completed || false,
        };
      });

      const assignedToIds = taskData.assignedTo.map((u) =>
        typeof u === "string" ? u : u._id
      );

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(id), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: updatedChecklist,
        assignedTo: assignedToIds,
      });

      toast.success("Task Updated Successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Update error:", error.response?.data?.message);
      } else {
        console.error("Unknown error:", (error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTaskDetailsByID = async (id: string) => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );
      if (data) {
        setCurrentTask(data);
        setTaskData({
          title: data.title,
          description: data.description,
          priority: data.priority || "Low",
          dueDate: data.dueDate
            ? moment(data.dueDate).format("YYYY-MM-DD")
            : "",
          assignedTo: data.assignedTo || [],
          todoChecklist:
            data.todoChecklist?.map((item: TodoItem) => item.text) || [],
          attachments: data.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      setError("Failed to fetch task details.");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(id));
      setOpenDeleteAlert(false);
      toast.success("Task Deleted Successfully");
      navigate("/admin/tasks");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Delete error:", error.response?.data?.message);
      } else {
        console.error("Unknown error:", (error as Error).message);
      }
    }
  };

  const handleSubmit = () => {
    setError("");

    if (!taskData.title.trim()) return setError("Title is required");
    if (!taskData.description.trim())
      return setError("Description is required");
    if (!taskData.dueDate) return setError("Due date is required");
    if (taskData.assignedTo.length === 0)
      return setError("Assign to at least one member");
    if (taskData.todoChecklist.length === 0)
      return setError("Add at least one TODO item");

    if (taskId) updateTask(taskId);
    else createTask();
  };

  useEffect(() => {
    if (taskId) getTaskDetailsByID(taskId);
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="form-card col-span-12">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-xl md:text-2xl">
              {taskId ? "Update Task" : "Create Task"}
            </h2>

            {taskId && (
              <button
                className="delete-btn"
                onClick={() => setOpenDeleteAlert(true)}>
                <LuTrash2 className="text-base" />
                Delete
              </button>
            )}
          </div>

          {/* Title */}
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

          {/* Description */}
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

          {/* Priority / Due Date / Assign */}
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
                className="form-input cursor-pointer"
                value={taskData.dueDate}
                onChange={({ target }) =>
                  handleValueChange("dueDate", target.value)
                }
                type="date"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <label className="form-label">Assign To</label>
              <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) =>
                  handleValueChange("assignedTo", value)
                }
              />
            </div>
          </div>

          {/* Todo List */}
          <div className="mt-3">
            <label className="form-label">TODO Checklist</label>
            <TodoListInput
              todoList={taskData.todoChecklist}
              setTodoList={(value) => handleValueChange("todoChecklist", value)}
            />
          </div>

          {/* Attachments */}
          <div className="mt-3">
            <label className="form-label">Add Attachments</label>
            <AddAttachmentsInput
              attachments={taskData.attachments}
              setAttachments={(value) =>
                handleValueChange("attachments", value)
              }
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-7">
            <button
              className="button-gradient relative"
              onClick={handleSubmit}
              disabled={loading}>
              {taskId ? "UPDATE TASK" : "CREATE TASK"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task">
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask(taskId)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
