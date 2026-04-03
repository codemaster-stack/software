// ============================================================
//  routes/email.js — Professional Email Sender
//  Primary:  Resend API (HTTPS — works on Render free plan)
//  Fallback: Zoho SMTP
//  Angeluni-salltd | Supper Needs Int'l Ltd
// ============================================================

const express     = require("express");
const multer      = require("multer");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Logo embedded as base64 — shows in all email clients
const LOGO_BASE64 = "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";

// Multer — memory storage for attachments (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },
});

// ── Email HTML Template ───────────────────────────────────
const buildEmailHTML = ({ recipientName, subject, message, senderName }) => {
  const year         = new Date().getFullYear();
  const whatsappUrl  = "https://wa.me/2348063437093";
  const youtubeUrl   = "https://youtube.com/@ANGELUNI-SALLTD";
  const websiteUrl   = "https://www.angeluni-salltd.com";
  const facebookUrl  = "#";
  const instagramUrl = "#";
  const htmlMessage  = (message || "").replace(/\n/g, "<br/>");
  // Use CID reference — embeds image as attachment, shows in all clients
  const logoSrc = "cid:angeluni_logo";

  return `<!DOCTYPE html>
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
    .letterhead::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#00e5bd,#0099cc,#00e5bd);}
    .logo-area{display:flex;align-items:center;gap:16px;margin-bottom:20px;}
    .logo-img{width:64px;height:64px;object-fit:contain;}
    .logo-name{font-size:22px;font-weight:800;color:#fff;line-height:1.1;}
    .logo-name span{color:#00e5bd;}
    .logo-tagline{font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.15em;text-transform:uppercase;margin-top:4px;}
    .lh-divider{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0;}
    .company-meta{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;}
    .company-legal{font-size:11px;color:rgba(255,255,255,0.45);line-height:1.6;}
    .email-date{font-size:11px;color:rgba(255,255,255,0.4);}
    .email-body{padding:40px;}
    .greeting{font-size:18px;font-weight:700;color:#060b14;margin-bottom:20px;}
    .message-content{font-size:15px;line-height:1.8;color:#3a4a5c;word-break:break-word;}
    .divider{border:none;border-top:1px solid #e8edf5;margin:32px 0;}
    .cta-section{text-align:center;margin:28px 0;}
    .cta-btn{display:inline-block;background:linear-gradient(135deg,#00e5bd,#0099cc);color:#060b14!important;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;}
    .signature{background:#f8fafc;border-left:3px solid #00e5bd;border-radius:0 8px 8px 0;padding:20px 24px;}
    .sig-name{font-size:15px;font-weight:700;color:#060b14;}
    .sig-title{font-size:12px;color:#00e5bd;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:4px 0 8px;}
    .sig-contact{font-size:12px;color:#6b7a8d;line-height:1.9;}
    .sig-contact a{color:#0099cc;text-decoration:none;}
    .social-section{background:#060b14;padding:24px 40px;text-align:center;}
    .social-label{font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:16px;}
    .social-icons{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;}
    .social-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;color:#fff!important;}
    .btn-wa{background:#25d366;} .btn-yt{background:#ff0000;} .btn-fb{background:#1877f2;}
    .btn-ig{background:linear-gradient(45deg,#f09433,#dc2743,#bc1888);}
    .btn-web{background:#00e5bd;color:#060b14!important;}
    .email-footer{background:#0c1526;padding:20px 40px;text-align:center;}
    .footer-text{font-size:11px;color:rgba(255,255,255,0.3);line-height:1.7;}
    .footer-text a{color:#00e5bd;text-decoration:none;}
    @media(max-width:480px){
      .wrapper{margin:0;border-radius:0;}
      .letterhead,.email-body,.social-section,.email-footer{padding-left:20px;padding-right:20px;}
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="letterhead">
    <div class="logo-area">
      <img src="${logoSrc}" alt="Angeluni-salltd Logo" class="logo-img"/>
      <div>
        <div class="logo-name">ANGELUNI<span>-salltd</span></div>
        <div class="logo-tagline">Software Development Studio</div>
      </div>
    </div>
    <hr class="lh-divider"/>
    <div class="company-meta">
      <div class="company-legal">Supper Needs Int'l Ltd &nbsp;|&nbsp; contact@angeluni-salltd.com<br/>Professional Web &amp; Software Development</div>
      <div class="email-date">${new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
    </div>
  </div>

  <div class="email-body">
    <div class="greeting">Dear ${recipientName || "Valued Client"},</div>
    <div class="message-content">${htmlMessage}</div>
    <hr class="divider"/>
    <div class="cta-section">
      <a href="${whatsappUrl}" class="cta-btn">&#128172; Chat With Us on WhatsApp</a>
    </div>
    <hr class="divider"/>
    <div class="signature">
      <div class="sig-name">${senderName || "The Angeluni-salltd Team"}</div>
      <div class="sig-title">Supper Needs Int'l Ltd</div>
      <div class="sig-contact">
        &#128231; <a href="mailto:contact@angeluni-salltd.com">contact@angeluni-salltd.com</a><br/>
        &#128241; <a href="${whatsappUrl}">+234 806 343 7093</a><br/>
        &#127760; <a href="${websiteUrl}">${websiteUrl}</a>
      </div>
    </div>
  </div>

  <div class="social-section">
    <div class="social-label">Connect With Us</div>
    <div class="social-icons">
      <a href="${whatsappUrl}"  class="social-btn btn-wa">&#128172; WhatsApp</a>
      <a href="${youtubeUrl}"   class="social-btn btn-yt">&#9654; YouTube</a>
      <a href="${facebookUrl}"  class="social-btn btn-fb">f Facebook</a>
      <a href="${instagramUrl}" class="social-btn btn-ig">&#128247; Instagram</a>
      <a href="${websiteUrl}"   class="social-btn btn-web">&#127760; Website</a>
    </div>
  </div>

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

// ── Send via Resend API ───────────────────────────────────
const sendViaResend = async ({ to, from, replyTo, subject, html, text, attachmentFile }) => {
  const { Resend } = require("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Include logo as inline CID attachment — shows in all email clients
  const attachments = [{
    filename:   "logo.png",
    content:    Buffer.from("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", "base64"),
    content_id: "angeluni_logo",
  }];

  // Add file attachment if present
  if (attachmentFile) {
    attachments.push({
      filename: attachmentFile.originalname,
      content:  attachmentFile.buffer,
    });
  }

  const payload = {
    from:        from,
    to:          [to],
    replyTo:     replyTo,
    subject:     subject,
    html:        html,
    text:        text,
    attachments: attachments,
  };

  const { data, error } = await resend.emails.send(payload);
  if (error) throw new Error(error.message || JSON.stringify(error));
  return data;
};

// ── Send via Zoho SMTP (fallback) ─────────────────────────
const sendViaZoho = async ({ to, from, replyTo, subject, html, text, attachmentFile }) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host:   "smtp.zoho.com",
    port:    465,
    secure:  true,
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout:   15000,
    socketTimeout:     20000,
  });

  const mailOptions = { from, to, replyTo, subject, html, text };

  if (attachmentFile) {
    mailOptions.attachments = [{
      filename:    attachmentFile.originalname,
      content:     attachmentFile.buffer,
      contentType: attachmentFile.mimetype,
    }];
  }

  return await transporter.sendMail(mailOptions);
};

// ── POST /api/email/send (PROTECTED) ─────────────────────
router.post("/send", protect, upload.single("attachment"), async (req, res) => {
  try {
    const { recipientEmail, recipientName, subject, message, senderName } = req.body;

    // Validation
    if (!recipientEmail) return res.status(400).json({ success: false, message: "Recipient email is required." });
    if (!subject)        return res.status(400).json({ success: false, message: "Subject is required." });
    if (!message)        return res.status(400).json({ success: false, message: "Message is required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({ success: false, message: "Invalid recipient email address." });
    }

    const fromAddress  = `Angeluni-salltd <contact@angeluni-salltd.com>`;
    const replyTo      = "contact@angeluni-salltd.com";
    const htmlContent  = buildEmailHTML({ recipientName, subject, message, senderName });
    const textContent  = `Dear ${recipientName || "Valued Client"},\n\n${message}\n\nBest regards,\n${senderName || "The Angeluni-salltd Team"}\ncontact@angeluni-salltd.com\nhttps://www.angeluni-salltd.com`;

    const payload = {
      to:             recipientEmail,
      from:           fromAddress,
      replyTo:        replyTo,
      subject:        subject,
      html:           htmlContent,
      text:           textContent,
      attachmentFile: req.file || null,
    };

    // Use Resend if API key is set (recommended)
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(payload);
      console.log(`✅ Email sent via Resend to ${recipientEmail}`);
    } else if (process.env.ZOHO_USER && process.env.ZOHO_PASSWORD) {
      await sendViaZoho(payload);
      console.log(`✅ Email sent via Zoho to ${recipientEmail}`);
    } else {
      return res.status(500).json({
        success: false,
        message: "No email provider configured. Add RESEND_API_KEY to Render environment variables.",
      });
    }

    res.json({ success: true, message: `Email sent successfully to ${recipientEmail}` });

  } catch (error) {
    console.error("Email send error:", { code: error.code, message: error.message });

    let msg = `Email failed: ${error.message}`;
    if (error.code === "ETIMEDOUT") msg = "SMTP connection timed out. Add RESEND_API_KEY to Render — it works without SMTP.";
    if (error.code === "EAUTH")     msg = "Authentication failed. Check your credentials on Render.";

    res.status(500).json({ success: false, message: msg });
  }
});

// ── GET /api/email/test (PROTECTED) ──────────────────────
router.get("/test", protect, async (req, res) => {
  try {
    const testTo   = process.env.ZOHO_USER || process.env.GMAIL_USER || "contact@angeluni-salltd.com";
    const htmlContent = buildEmailHTML({
      recipientName: "Admin",
      subject:       "Email Setup Test",
      message:       "Your email system is working correctly!\n\nYou can now send professional branded emails from your Angeluni-salltd dashboard.\n\nThe logo, social links, and website URL are all included.",
      senderName:    "Angeluni-salltd System",
    });

    const payload = {
      to:             testTo,
      from:           "Angeluni-salltd <contact@angeluni-salltd.com>",
      replyTo:        "contact@angeluni-salltd.com",
      subject:        "Email Setup Test — Angeluni-salltd",
      html:           htmlContent,
      text:           "Email system working correctly.",
      attachmentFile: null,
    };

    if (process.env.RESEND_API_KEY) {
      await sendViaResend(payload);
      res.json({ success: true, message: `Test email sent via Resend to ${testTo}` });
    } else {
      await sendViaZoho(payload);
      res.json({ success: true, message: `Test email sent via Zoho to ${testTo}` });
    }

  } catch (error) {
    console.error("Test email error:", error.code, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;