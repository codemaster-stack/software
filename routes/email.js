// ============================================================
//  routes/email.js — Professional Email Sender
//  Gmail SMTP via Nodemailer | Angeluni-salltd
// ============================================================

const express     = require("express");
const nodemailer  = require("nodemailer");
const multer      = require("multer");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Multer — memory storage for attachments (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ── Gmail transporter ─────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// ── Email HTML template ───────────────────────────────────
const buildEmailHTML = ({ recipientName, subject, message, senderName }) => {
  const year         = new Date().getFullYear();
  const whatsappUrl  = "https://wa.me/2348063437093";
  const youtubeUrl   = "https://youtube.com/@ANGELUNI-SALLTD";
  const websiteUrl   = "https://www.angeluni-salltd.com";
  const facebookUrl  = "#";
  const instagramUrl = "#";

  // Convert newlines in message to <br> for HTML display
  const htmlMessage = (message || "").replace(/\n/g, "<br/>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${subject}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;color:#1a2332;}
    .wrapper{max-width:620px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);}
    .letterhead{background:linear-gradient(135deg,#060b14 0%,#0c1526 60%,#0a2a3a 100%);padding:36px 40px 28px;position:relative;overflow:hidden;}
    .letterhead::before{content:'';position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,rgba(0,229,189,0.15) 0%,transparent 70%);border-radius:50%;}
    .letterhead::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00e5bd,#0099cc,#00e5bd);}
    .logo-area{display:flex;align-items:center;gap:16px;margin-bottom:20px;}
    .logo-img{width:64px;height:64px;object-fit:contain;}
    .logo-name{font-size:22px;font-weight:800;color:#fff;letter-spacing:0.02em;line-height:1.1;}
    .logo-name span{color:#00e5bd;}
    .logo-tagline{font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.15em;text-transform:uppercase;margin-top:4px;}
    .lh-divider{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0;}
    .company-meta{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;}
    .company-legal{font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6;}
    .email-date{font-size:11px;color:rgba(255,255,255,0.4);text-align:right;}
    .email-body{padding:40px 40px 32px;background:#fff;}
    .greeting{font-size:18px;font-weight:700;color:#060b14;margin-bottom:20px;}
    .message-content{font-size:15px;line-height:1.8;color:#3a4a5c;word-break:break-word;}
    .divider{border:none;border-top:1px solid #e8edf5;margin:32px 0;}
    .cta-section{text-align:center;margin:28px 0;}
    .cta-btn{display:inline-block;background:linear-gradient(135deg,#00e5bd,#0099cc);color:#060b14!important;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.03em;}
    .signature{background:#f8fafc;border-left:3px solid #00e5bd;border-radius:0 8px 8px 0;padding:20px 24px;margin-top:8px;}
    .sig-name{font-size:15px;font-weight:700;color:#060b14;margin-bottom:2px;}
    .sig-title{font-size:12px;color:#00e5bd;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;}
    .sig-contact{font-size:12px;color:#6b7a8d;line-height:1.8;}
    .sig-contact a{color:#0099cc;text-decoration:none;}
    .social-section{background:#060b14;padding:24px 40px;text-align:center;}
    .social-label{font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px;}
    .social-icons{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;}
    .social-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;color:#fff!important;}
    .btn-whatsapp{background:#25d366;}
    .btn-youtube{background:#ff0000;}
    .btn-facebook{background:#1877f2;}
    .btn-instagram{background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);}
    .btn-website{background:#00e5bd;color:#060b14!important;}
    .email-footer{background:#0c1526;padding:20px 40px;text-align:center;}
    .footer-text{font-size:11px;color:rgba(255,255,255,0.3);line-height:1.7;}
    .footer-text a{color:#00e5bd;text-decoration:none;}
    @media(max-width:480px){
      .wrapper{margin:0;border-radius:0;}
      .letterhead,.email-body,.social-section,.email-footer{padding-left:24px;padding-right:24px;}
      .social-icons{gap:8px;}
      .social-btn{padding:8px 12px;font-size:11px;}
    }
  </style>
</head>
<body>
<div class="wrapper">

  <!-- LETTERHEAD -->
  <div class="letterhead">
    <div class="logo-area">
      <img src="${websiteUrl}/logo.png" alt="Angeluni-salltd" class="logo-img"/>
      <div>
        <div class="logo-name">ANGELUNI<span>-salltd</span></div>
        <div class="logo-tagline">Software Development Studio</div>
      </div>
    </div>
    <hr class="lh-divider"/>
    <div class="company-meta">
      <div class="company-legal">
        Supper Needs Int'l Ltd &nbsp;|&nbsp; contact@angeluni-salltd.com<br/>
        Professional Web &amp; Software Development
      </div>
      <div class="email-date">
        ${new Date().toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="email-body">
    <div class="greeting">Dear ${recipientName || "Valued Client"},</div>
    <div class="message-content">${htmlMessage}</div>
    <hr class="divider"/>

    <!-- CTA -->
    <div class="cta-section">
      <a href="${whatsappUrl}" class="cta-btn">💬 Chat With Us on WhatsApp</a>
    </div>

    <hr class="divider"/>

    <!-- SIGNATURE -->
    <div class="signature">
      <div class="sig-name">${senderName || "The Angeluni-salltd Team"}</div>
      <div class="sig-title">Supper Needs Int'l Ltd</div>
      <div class="sig-contact">
        📧 <a href="mailto:contact@angeluni-salltd.com">contact@angeluni-salltd.com</a><br/>
        📱 <a href="${whatsappUrl}">+234 806 343 7093</a><br/>
        🌐 <a href="${websiteUrl}">${websiteUrl}</a>
      </div>
    </div>
  </div>

  <!-- SOCIAL -->
  <div class="social-section">
    <div class="social-label">Connect With Us</div>
    <div class="social-icons">
      <a href="${whatsappUrl}" class="social-btn btn-whatsapp" target="_blank">💬 WhatsApp</a>
      <a href="${youtubeUrl}"  class="social-btn btn-youtube"  target="_blank">▶ YouTube</a>
      <a href="${facebookUrl}" class="social-btn btn-facebook">f Facebook</a>
      <a href="${instagramUrl}"class="social-btn btn-instagram">📸 Instagram</a>
      <a href="${websiteUrl}"  class="social-btn btn-website"  target="_blank">🌐 Website</a>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="email-footer">
    <div class="footer-text">
      &copy; ${year} Supper Needs Int'l Ltd. All rights reserved.<br/>
      Angeluni-salltd is a registered trading name.<br/>
      <a href="${websiteUrl}">Visit Website</a> &nbsp;|&nbsp;
      <a href="mailto:contact@angeluni-salltd.com">Contact Us</a>
    </div>
  </div>

</div>
</body>
</html>`;
};

// ── POST /api/email/send (PROTECTED) ─────────────────────
// Accepts multipart/form-data (with optional attachment)
// OR application/json (without attachment)
router.post("/send", protect, upload.single("attachment"), async (req, res) => {
  try {
    const {
      recipientEmail,
      recipientName,
      subject,
      message,
      senderName,
    } = req.body;

    // Validation
    if (!recipientEmail) return res.status(400).json({ success: false, message: "Recipient email is required." });
    if (!subject)        return res.status(400).json({ success: false, message: "Subject is required." });
    if (!message)        return res.status(400).json({ success: false, message: "Message is required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({ success: false, message: "Invalid recipient email address." });
    }

    // Check Gmail credentials are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({ success: false, message: "Email credentials not configured on server. Add GMAIL_USER and GMAIL_APP_PASSWORD to Render environment variables." });
    }

    const transporter = createTransporter();

    // Verify Gmail connection before sending
    await transporter.verify();

    const mailOptions = {
      from:    `"Angeluni-salltd" <${process.env.GMAIL_USER}>`,
      to:       recipientEmail,
      replyTo: "contact@angeluni-salltd.com",
      subject:  subject,
      html:     buildEmailHTML({ recipientName, subject, message, senderName }),
      text:     `Dear ${recipientName || "Valued Client"},\n\n${message}\n\nBest regards,\n${senderName || "The Angeluni-salltd Team"}\ncontact@angeluni-salltd.com\nhttps://www.angeluni-salltd.com`,
    };

    // Add attachment if file uploaded
    if (req.file) {
      mailOptions.attachments = [{
        filename:    req.file.originalname,
        content:     req.file.buffer,
        contentType: req.file.mimetype,
      }];
    }

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success:   true,
      message:   `Email sent successfully to ${recipientEmail}`,
      messageId: info.messageId,
    });

  } catch (error) {
    console.error("Email send error:", error.code, error.message);

    let msg = "Failed to send email. Please try again.";
    if (error.code === "EAUTH")       msg = "Gmail authentication failed. Check your App Password in Render environment variables.";
    if (error.code === "ECONNECTION") msg = "Could not connect to Gmail. Check server internet connection.";
    if (error.responseCode === 535)   msg = "Gmail App Password is incorrect. Please regenerate it in your Google Account.";
    if (error.responseCode === 534)   msg = "Gmail requires App Password. Enable 2-Step Verification and generate an App Password.";

    res.status(500).json({ success: false, message: msg });
  }
});

// ── GET /api/email/test (PROTECTED) ──────────────────────
router.get("/test", protect, async (req, res) => {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({ success: false, message: "GMAIL_USER and GMAIL_APP_PASSWORD not set in environment variables." });
    }

    const transporter = createTransporter();
    await transporter.verify();

    await transporter.sendMail({
      from:    `"Angeluni-salltd" <${process.env.GMAIL_USER}>`,
      to:       process.env.GMAIL_USER,
      replyTo: "contact@angeluni-salltd.com",
      subject: "✅ Email Setup Test — Angeluni-salltd",
      html:    buildEmailHTML({
        recipientName: "Admin",
        subject:       "Email Setup Test",
        message:       "Your email system is working correctly!\n\nYou can now send professional branded emails from your Angeluni-salltd dashboard.\n\nThis email includes your logo, social media links, website link, and signature.",
        senderName:    "Angeluni-salltd System",
      }),
    });

    res.json({ success: true, message: "Test email sent to " + process.env.GMAIL_USER });
  } catch (error) {
    console.error("Test email error:", error.code, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;