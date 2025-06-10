const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      minlength: [5, "Email must be at least 5 characters"],
      maxlength: [254, "Email cannot exceed 254 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [3, "Password must be at least 6 characters"],
      maxlength: [254, "Password cannot exceed 128 characters"],
    },
    profileImageUrl: { type: String, default: null },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
