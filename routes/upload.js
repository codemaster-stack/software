// ============================================================
//  routes/upload.js — Image Upload via Cloudinary
//  Protected — JWT required
// ============================================================

const express    = require("express");
const cloudinary = require("cloudinary").v2;
const multer     = require("multer");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ── Configure Cloudinary ──────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer — store in memory before uploading ─────────────
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (JPG, PNG, WebP, GIF)"));
    }
  },
});

// ── POST /api/upload/image (PROTECTED) ───────────────────
router.post("/image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided." });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder:         "angeluni-salltd/projects",
          transformation: [{ width: 800, height: 500, crop: "fill", quality: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success:  true,
      message:  "Image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message || "Upload failed." });
  }
});

// ── DELETE /api/upload/image (PROTECTED) ─────────────────
router.delete("/image", protect, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ success: false, message: "Public ID required." });

    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: "Image deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed." });
  }
});

module.exports = router;