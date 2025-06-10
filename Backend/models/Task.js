const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Todo item text is required"],
    minlength: [3, "Todo text must be at least 3 characters"],
    maxlength: [200, "Todo text cannot exceed 200 characters"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: [true, "Completed status is required"],
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be either Low, Medium, or High",
      },
      default: "Medium",
      required: [true, "Priority is required"],
    },
    statue: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "Status must be either Pending, In Progress, or Completed",
      },
      default: "Pending",
      required: [true, "Status is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Due date cannot be in the past",
      },
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Assigned user is required"],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task creator is required"],
    },
    attachments: [
      {
        type: String,
        validate: {
          validator: function (value) {
            // Basic URL validation
            return /^https?:\/\/.*\/.*\.(png|jpg|jpeg|gif|pdf|doc|docx)$/i.test(
              value
            );
          },
          message: "Invalid attachment URL format",
        },
      },
    ],
    todoChecklist: [todoSchema],
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0%"],
      max: [100, "Progress cannot exceed 100%"],
      validate: {
        validator: function (value) {
          return Number.isInteger(value);
        },
        message: "Progress must be a whole number",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
