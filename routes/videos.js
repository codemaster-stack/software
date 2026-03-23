// ============================================================
//  routes/videos.js — Videos CRUD API
//
//  PUBLIC  (no auth):
//    GET    /api/videos          → list all visible videos
//    GET    /api/videos/:id      → single video
//
//  PROTECTED (JWT required):
//    POST   /api/videos          → create video
//    PUT    /api/videos/:id      → update video
//    DELETE /api/videos/:id      → delete video
//    PATCH  /api/videos/:id/toggle → toggle visibility
// ============================================================

const express = require("express");
const Video   = require("../models/Video");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── GET /api/videos (PUBLIC) ─────────────────────────────
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find({ isVisible: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── GET /api/videos/all (PROTECTED — includes hidden) ────
router.get("/all", protect, async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── GET /api/videos/:id (PUBLIC) ─────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── POST /api/videos (PROTECTED) ─────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, embedUrl, order } = req.body;

    const video = await Video.create({
      title,
      description,
      embedUrl: embedUrl || "",
      order:    order    || 0,
    });

    res.status(201).json({
      success: true,
      message: "Video created successfully.",
      data: video,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── PUT /api/videos/:id (PROTECTED) ──────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }

    res.json({
      success: true,
      message: "Video updated successfully.",
      data: video,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── PATCH /api/videos/:id/toggle (PROTECTED) ─────────────
router.patch("/:id/toggle", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }

    video.isVisible = !video.isVisible;
    await video.save();

    res.json({
      success: true,
      message: `Video ${video.isVisible ? "shown" : "hidden"}.`,
      data: video,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── DELETE /api/videos/:id (PROTECTED) ───────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found." });
    }

    res.json({ success: true, message: "Video deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;