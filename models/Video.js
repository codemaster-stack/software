// ============================================================
//  models/Video.js — Mongoose schema for video showcases
// ============================================================

const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Video description is required"],
      trim: true,
      maxlength: [400, "Description cannot exceed 400 characters"],
    },
    embedUrl: {
      type: String,
      default: "",
      trim: true,
      // Accepts YouTube or Vimeo embed URLs
      // e.g. https://www.youtube.com/embed/VIDEO_ID
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);