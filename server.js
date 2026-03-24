// ============================================================
//  server.js — Express application entry point
//  Angeluni-salltd Backend | Supper Needs Int'l Ltd
// ============================================================

require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const rateLimit  = require("express-rate-limit");
const connectDB  = require("./config/db");

// Route files
const authRoutes     = require("./routes/auth");
const projectRoutes  = require("./routes/projects");
const videoRoutes    = require("./routes/videos");

// ── Connect to MongoDB ───────────────────────────────────
connectDB();

const app = express();

// ── CORS ─────────────────────────────────────────────────
// Allow requests from your frontend URL
const allowedOrigins = [
  "www.angeluni-salltd.com",
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
].filter(Boolean); // removes undefined/null values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Body parsers ─────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────
// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many login attempts. Please wait 15 minutes." },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", loginLimiter);

// ── Health check ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Angeluni-salltd API is running",
    company: "Supper Needs Int'l Ltd",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", uptime: process.uptime() });
});

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/videos",   videoRoutes);

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message,
  });
});

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  console.log(`   API Base: http://localhost:${PORT}/api`);
});