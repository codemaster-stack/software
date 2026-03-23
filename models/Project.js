// ============================================================
//  models/Project.js — Mongoose schema for portfolio projects
// ============================================================

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [600, "Description cannot exceed 600 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["website", "webapp", "ecommerce"],
        message: "Category must be website, webapp, or ecommerce",
      },
    },
    icon: {
      type: String,
      default: "🌐",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Maximum 10 tags allowed",
      },
    },
    demoUrl: {
      type: String,
      default: "#",
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true, // Admin can hide projects without deleting
    },
    order: {
      type: Number,
      default: 0, // For custom sort order
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Project", projectSchema);