const nodemailer = require("nodemailer");

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
  });

  await transporter.sendMail({
    from: "test@example.com",
    to: "hello@example.com",
    subject: "Hello from MailHog",
    text: "If you see this in MailHog, it works!",
  });

  console.log("Email sent!");
}

sendTestEmail();
