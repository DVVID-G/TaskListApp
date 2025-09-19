// ...existing code...
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

/**
 * Envía email de restablecimiento con template visual.
 * @param {string} to
 * @param {string} token
 */
async function sendResetEmail(to, token) {
  const frontend = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
  const resetUrl = `${frontend}/reset-password?token=${encodeURIComponent(token)}`;
  const from = process.env.MAIL_FROM || "TaskListApp <no-reply@tasklistapp.local>";

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body { background:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; padding:20px; }
      .container { max-width:600px; margin:32px auto; background:#ffffff; border-radius:8px; box-shadow:0 6px 18px rgba(15,23,42,0.08); overflow:hidden; }
      .header { background:#2d8cff; color:#fff; padding:20px 24px; font-size:20px; font-weight:700; }
      .body { padding:24px; color:#1f2937; line-height:1.5; }
      .btn { display:inline-block; background:#2d8cff; color:#fff; padding:12px 18px; border-radius:8px; text-decoration:none; font-weight:600; margin-top:12px; }
      .muted { color:#6b7280; font-size:13px; margin-top:16px; }
      .footer { padding:16px 24px; font-size:12px; color:#9ca3af; text-align:center; background:#fafafa; }
      a.link { color:#2563eb; word-break:break-all; }
      .center { text-align:center; } /* centered wrapper for the CTA button */
      @media (max-width:480px){ .container{ margin:12px; } }
    </style>
  </head>
  <body>
    <div class="container" role="article" aria-label="Restablecer contraseña">
      <div class="header">TaskListApp</div>
      <div class="body">
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Pulsa el botón siguiente para crear una nueva contraseña. El enlace expirará en 1 hora.</p>
        <p class="center"><a class="btn" href="${resetUrl}">Restablecer contraseña</a></p>

        <p class="muted">Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
        <p><a class="link" href="${resetUrl}">${resetUrl}</a></p>

        <p class="muted">Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} TaskListApp — Protege tu cuenta</div>
    </div>
  </body>
  </html>
  `;

  const text = `Restablecer contraseña\n\nVisita: ${resetUrl}\n\nSi no solicitaste este cambio, ignora este correo.`;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Restablece tu contraseña — TaskListApp",
      text,
      html,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Reset email sent:", info.messageId || info);
    }
    return info;
  } catch (err) {
    console.error("Error sending reset email:", err && err.message ? err.message : err);
    throw err;
  }
}

module.exports = sendResetEmail;
// ...existing code...