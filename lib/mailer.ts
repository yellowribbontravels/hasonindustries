import nodemailer from "nodemailer";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

if (!user || !pass) {
  console.warn("Gmail SMTP credentials missing. Email sending will fail.");
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

export const sendEmail = async (options: nodemailer.SendMailOptions) => {
  return transporter.sendMail({
    from: `"Hason Industries" <${user}>`,
    ...options,
  });
};
