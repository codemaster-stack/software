// ============================================================
//  routes/email.js — Professional Email Sender
//  Uses Gmail SMTP via Nodemailer
//  Protected — JWT required
// ============================================================

const express      = require("express");
const nodemailer   = require("nodemailer");
const { protect }  = require("../middleware/auth");

const router = express.Router();

// ── Gmail transporter ────────────────────────────────────
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
  const year = new Date().getFullYear();

  // Social links
  const whatsappUrl  = "https://wa.me/2348063437093";
  const youtubeUrl   = "https://youtube.com/@ANGELUNI-SALLTD";
  const facebookUrl  = "#";
  const instagramUrl = "#";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f0f4f8;
      color: #1a2332;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 620px;
      margin: 32px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    }

    /* ── LETTERHEAD ── */
    .letterhead {
      background: linear-gradient(135deg, #060b14 0%, #0c1526 60%, #0a2a3a 100%);
      padding: 36px 40px 28px;
      position: relative;
      overflow: hidden;
    }
    .letterhead::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(0,229,189,0.15) 0%, transparent 70%);
      border-radius: 50%;
    }
    .letterhead::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #00e5bd, #0099cc, #00e5bd);
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    .logo-img {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .logo-text-block {
      display: flex;
      flex-direction: column;
    }
    .logo-name {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.02em;
      line-height: 1.1;
    }
    .logo-name span { color: #00e5bd; }
    .logo-tagline {
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .letterhead-divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 16px 0;
    }
    .company-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 8px;
    }
    .company-legal {
      font-size: 11px;
      color: rgba(255,255,255,0.45);
      line-height: 1.6;
    }
    .email-date {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      text-align: right;
    }

    /* ── BODY ── */
    .email-body {
      padding: 40px 40px 32px;
      background: #ffffff;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #060b14;
      margin-bottom: 20px;
    }
    .message-content {
      font-size: 15px;
      line-height: 1.8;
      color: #3a4a5c;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .divider {
      border: none;
      border-top: 1px solid #e8edf5;
      margin: 32px 0;
    }

    /* ── CTA BUTTON ── */
    .cta-section {
      text-align: center;
      margin: 28px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #00e5bd, #0099cc);
      color: #060b14 !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.03em;
    }

    /* ── SIGNATURE ── */
    .signature {
      background: #f8fafc;
      border-left: 3px solid #00e5bd;
      border-radius: 0 8px 8px 0;
      padding: 20px 24px;
      margin-top: 8px;
    }
    .sig-name {
      font-size: 15px;
      font-weight: 700;
      color: #060b14;
      margin-bottom: 2px;
    }
    .sig-title {
      font-size: 12px;
      color: #00e5bd;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }
    .sig-contact {
      font-size: 12px;
      color: #6b7a8d;
      line-height: 1.7;
    }
    .sig-contact a {
      color: #0099cc;
      text-decoration: none;
    }

    /* ── SOCIAL ICONS ── */
    .social-section {
      background: #060b14;
      padding: 24px 40px;
      text-align: center;
    }
    .social-label {
      font-size: 11px;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .social-icons {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .social-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff !important;
      transition: opacity 0.2s;
    }
    .social-btn:hover { opacity: 0.85; }
    .btn-whatsapp  { background: #25d366; }
    .btn-youtube   { background: #ff0000; }
    .btn-facebook  { background: #1877f2; }
    .btn-instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
    .social-icon { font-size: 14px; }

    /* ── FOOTER ── */
    .email-footer {
      background: #0c1526;
      padding: 20px 40px;
      text-align: center;
    }
    .footer-text {
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      line-height: 1.7;
    }
    .footer-text a {
      color: #00e5bd;
      text-decoration: none;
    }

    /* Mobile */
    @media (max-width: 480px) {
      .wrapper { margin: 0; border-radius: 0; }
      .letterhead, .email-body, .social-section, .email-footer { padding-left: 24px; padding-right: 24px; }
      .company-meta { flex-direction: column; }
      .social-icons { gap: 8px; }
      .social-btn { padding: 8px 12px; font-size: 11px; }
    }
  </style>
</head>
<body>
<div class="wrapper">

  <!-- LETTERHEAD -->
  <div class="letterhead">
    <div class="logo-area">
      <img
        src="https://angeluni-two.vercel.app/logo.png"
        alt="Angeluni-salltd Logo"
        class="logo-img"
      />
      <div class="logo-text-block">
        <div class="logo-name">ANGELUNI<span>-salltd</span></div>
        <div class="logo-tagline">Software Development Studio</div>
      </div>
    </div>
    <hr class="letterhead-divider" />
    <div class="company-meta">
      <div class="company-legal">
        Supper Needs Int'l Ltd &nbsp;|&nbsp; contact@angeluni-salltd.com<br/>
        Professional Web &amp; Software Development
      </div>
      <div class="email-date">
        ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="email-body">
    <div class="greeting">
      Dear ${recipientName || "Valued Client"},
    </div>

    <div class="message-content">${message}</div>

    <hr class="divider" />

    <!-- CTA -->
    <div class="cta-section">
      <a href="${whatsappUrl}" class="cta-btn">
        💬 Chat With Us on WhatsApp
      </a>
    </div>

    <hr class="divider" />

    <!-- SIGNATURE -->
    <div class="signature">
      <div class="sig-name">${senderName || "The Angeluni-salltd Team"}</div>
      <div class="sig-title">Supper Needs Int'l Ltd</div>
      <div class="sig-contact">
        📧 <a href="mailto:contact@angeluni-salltd.com">contact@angeluni-salltd.com</a><br/>
        📱 <a href="${whatsappUrl}">+234 806 343 7093</a><br/>
        🌐 <a href="https://angeluni-two.vercel.app">angeluni-salltd.com</a>
      </div>
    </div>
  </div>

  <!-- SOCIAL ICONS -->
  <div class="social-section">
    <div class="social-label">Connect With Us</div>
    <div class="social-icons">
      <a href="${whatsappUrl}" class="social-btn btn-whatsapp" target="_blank">
        <span class="social-icon">💬</span> WhatsApp
      </a>
      <a href="${youtubeUrl}" class="social-btn btn-youtube" target="_blank">
        <span class="social-icon">▶</span> YouTube
      </a>
      <a href="${facebookUrl}" class="social-btn btn-facebook">
        <span class="social-icon">f</span> Facebook
      </a>
      <a href="${instagramUrl}" class="social-btn btn-instagram">
        <span class="social-icon">📸</span> Instagram
      </a>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="email-footer">
    <div class="footer-text">
      © ${year} Supper Needs Int'l Ltd. All rights reserved.<br/>
      Angeluni-salltd is a registered trading name.<br/>
      <a href="mailto:contact@angeluni-salltd.com">Unsubscribe</a> &nbsp;|&nbsp;
      <a href="https://angeluni-two.vercel.app">Visit Website</a>
    </div>
  </div>

</div>
</body>
</html>
  `;
};

// ── POST /api/email/send (PROTECTED) ─────────────────────
router.post("/send", protect, async (req, res) => {
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

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({ success: false, message: "Invalid recipient email address." });
    }

    const transporter = createTransporter();

    // Verify Gmail connection
    await transporter.verify();

    const mailOptions = {
      from:     `"Angeluni-salltd" <${process.env.GMAIL_USER}>`,
      to:       recipientEmail,
      replyTo:  "contact@angeluni-salltd.com",
      subject:  subject,
      html:     buildEmailHTML({ recipientName, subject, message, senderName }),
      text:     `Dear ${recipientName || "Valued Client"},\n\n${message}\n\nBest regards,\n${senderName || "The Angeluni-salltd Team"}\ncontact@angeluni-salltd.com`,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Email sent successfully to ${recipientEmail}`,
      messageId: info.messageId,
    });

  } catch (error) {
    console.error("Email send error:", error);

    // Friendly error messages
    let msg = "Failed to send email. Please try again.";
    if (error.code === "EAUTH")         msg = "Gmail authentication failed. Check your App Password in Render environment variables.";
    if (error.code === "ECONNECTION")   msg = "Could not connect to Gmail. Check your internet connection.";
    if (error.responseCode === 535)     msg = "Gmail App Password is incorrect. Please regenerate it.";

    res.status(500).json({ success: false, message: msg });
  }
});

// ── GET /api/email/test (PROTECTED) ──────────────────────
// Send a test email to the admin's own Gmail to verify setup
router.get("/test", protect, async (req, res) => {
  try {
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
        message:       "Your email system is working correctly! You can now send professional branded emails from your Angeluni-salltd dashboard.",
        senderName:    "Angeluni-salltd System",
      }),
    });

    res.json({ success: true, message: "Test email sent to " + process.env.GMAIL_USER });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;