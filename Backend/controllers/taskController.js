const Task = require("../models/Task");

// @desc    Get all tasks (Admin: all, User: only assingned tasks)
// @route   GET /api/tasks/
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }

    // Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks/
// @access  Private (Admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      todoChecklist,
      attachments,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user ID's" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if user is assigned to this task or is admin
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.todoChecklist = todoChecklist;

    // Calculate progress based on completed items
    const totalItems = todoChecklist.length;
    const completedItems = todoChecklist.filter(
      (item) => item.completed
    ).length;
    task.progress =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Update status based on progress
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    res.json({
      message: "Task checklist updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dashboard Data (Admin only)
// @route   GET /api/tasks/dashboard-data
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    // Task Statistics
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ statue: "Pending" });
    const inProgressTasks = await Task.countDocuments({
      statue: "In Progress",
    });
    const completedTasks = await Task.countDocuments({ statue: "Completed" });

    // Priority Distribution
    const highPriorityTasks = await Task.countDocuments({ priority: "High" });
    const mediumPriorityTasks = await Task.countDocuments({
      priority: "Medium",
    });
    const lowPriorityTasks = await Task.countDocuments({ priority: "Low" });

    // Recent Tasks (last 5)
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name email profileImageUrl");

    // Upcoming Deadlines (next 5 tasks)
    const upcomingDeadlines = await Task.find({
      dueDate: { $gte: new Date() },
      statue: { $ne: "Completed" },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .populate("assignedTo", "name email profileImageUrl");

    // Tasks Per User (for visualization)
    const tasksPerUser = await Task.aggregate([
      {
        $unwind: "$assignedTo",
      },
      {
        $group: {
          _id: "$assignedTo",
          taskCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          _id: 1,
          taskCount: 1,
          userName: { $arrayElemAt: ["$userInfo.name", 0] },
        },
      },
    ]);

    res.json({
      taskStats: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      priorityDistribution: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
      recentTasks,
      upcomingDeadlines,
      tasksPerUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dashboard Data (User-specific)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private
const getUserDashboardData = async (req, res) => {
  try {
    // User's Task Statistics
    const totalTasks = await Task.countDocuments({ assignedTo: req.user._id });
    const pendingTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      statue: "Pending",
    });
    const inProgressTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      statue: "In Progress",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      statue: "Completed",
    });

    // Priority Distribution for User's Tasks
    const highPriorityTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      priority: "High",
    });
    const mediumPriorityTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      priority: "Medium",
    });
    const lowPriorityTasks = await Task.countDocuments({
      assignedTo: req.user._id,
      priority: "Low",
    });

    // User's Recent Tasks (last 5)
    const recentTasks = await Task.find({ assignedTo: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name");

    // User's Upcoming Deadlines (next 5 tasks)
    const upcomingDeadlines = await Task.find({
      assignedTo: req.user._id,
      dueDate: { $gte: new Date() },
      statue: { $ne: "Completed" },
    })
      .sort({ dueDate: 1 })
      .limit(5);

    // Monthly Task Completion Rate
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await Task.aggregate([
      {
        $match: {
          assignedTo: req.user._id,
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$statue",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      taskStats: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      priorityDistribution: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
      recentTasks,
      upcomingDeadlines,
      monthlyStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
