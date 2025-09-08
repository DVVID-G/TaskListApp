const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_TOKEN; // Pon tu token en el .env

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

async function sendResetEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset?token=${token}`;

  await transport.sendMail({
    from: {
      address: "hello@demomailtrap.co",
      name: "TaskListApp"
    },
    to: [email],
    subject: "Restablece tu contraseña",
    html: `
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña (válido por 1 hora):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `,
    category: "Recuperación de contraseña"
  });
}

module.exports = sendResetEmail;

