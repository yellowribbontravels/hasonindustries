import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

console.log("Using user:", user);

if (!user || !pass) {
  console.log("Credentials missing from process.env!");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: `"Hason Industries" <${user}>`,
      to: user, // send to self
      subject: "SMTP Debug Test",
      html: "<p>If you see this, SMTP is working.</p>",
    });
    console.log("Success! Message sent:", info.messageId);
  } catch (error) {
    console.error("FAIL:", error);
  }
}

run();
