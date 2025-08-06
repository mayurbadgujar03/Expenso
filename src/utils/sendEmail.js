import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendMagicLinkEmail = async (to, magicLink) => {
  const mailOptions = {
    from: '"Expenso" <no-reply@expenso.com>',
    to,
    subject: "Your Magic Login Link",
    html: `
      <h2>Hi 👋</h2>
      <p>Click the button below to log in securely to Expenso. This link will expire in 10 minutes.</p>
      <a href="${magicLink}" target="_blank" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
      <p>If you did not request this, just ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendMagicLinkEmail };
