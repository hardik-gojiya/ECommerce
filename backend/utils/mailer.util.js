import nodemailer from "nodemailer";

const nodeMailerFunc = async (toemail, subject, text) => {
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `Ecommerce <${process.env.EMAIL_USER}>`,
    to: toemail,
    subject: subject,
    html: `${text}`,
  };

  const info = await transporter.sendMail(mailOptions);
  if (!info || !info.accepted || info.accepted.length === 0) {
    throw new Error("Failed to send email");
  }
  return "Mail sent successfully";
};

export { nodeMailerFunc };
