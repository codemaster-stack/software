// ============================================================
//  routes/projects.js — Projects CRUD API
//
//  PUBLIC  (no auth):
//    GET    /api/projects          → list all visible projects
//    GET    /api/projects/:id      → single project
//
//  PROTECTED (JWT required):
//    POST   /api/projects          → create project
//    PUT    /api/projects/:id      → update project
//    DELETE /api/projects/:id      → delete project
//    PATCH  /api/projects/:id/toggle → toggle visibility
// ============================================================

const express = require("express");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── GET /api/projects (PUBLIC) ───────────────────────────
// Returns all visible projects, sorted by order then newest first.
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isVisible: true };
    if (category && category !== "all") {
      filter.category = category;
    }

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── GET /api/projects/all (PROTECTED — includes hidden) ──
router.get("/all", protect, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── GET /api/projects/:id (PUBLIC) ───────────────────────
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── POST /api/projects (PROTECTED) ───────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, icon, tags, demoUrl, order } = req.body;

    const project = await Project.create({
      title,
      description,
      category,
      icon:    icon    || "🌐",
      tags:    tags    || [],
      demoUrl: demoUrl || "#",
      order:   order   || 0,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    console.error("Create project error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── PUT /api/projects/:id (PROTECTED) ────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    res.json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── PATCH /api/projects/:id/toggle (PROTECTED) ───────────
// Toggle visibility without full update
router.patch("/:id/toggle", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    project.isVisible = !project.isVisible;
    await project.save();

    res.json({
      success: true,
      message: `Project ${project.isVisible ? "shown" : "hidden"}.`,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── DELETE /api/projects/:id (PROTECTED) ─────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;