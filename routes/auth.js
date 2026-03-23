// ============================================================
//  routes/auth.js — Admin authentication routes
//
//  POST /api/auth/login  → validates credentials, returns JWT
//  GET  /api/auth/verify → checks if current token is valid
// ============================================================

const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── POST /api/auth/login ─────────────────────────────────
// Accepts { username, password }, returns JWT on success.
// Credentials are stored in .env (no database user table needed).
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Check username against env variable
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Compare password — supports both plain text (dev) and bcrypt hash (prod)
    const storedPassword = process.env.ADMIN_PASSWORD;
    let isMatch = false;

    if (storedPassword.startsWith("$2")) {
      // Stored as bcrypt hash
      isMatch = await bcrypt.compare(password, storedPassword);
    } else {
      // Plain text comparison (acceptable for single-admin env var setup)
      isMatch = password === storedPassword;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { username: process.env.ADMIN_USERNAME, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── GET /api/auth/verify ─────────────────────────────────
// Protected route — verifies the token is still valid.
// Frontend calls this on admin page load to stay logged in.
router.get("/verify", protect, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid.",
    admin: req.admin,
  });
});

module.exports = router;