const nodemailer = require("nodemailer");
const otpEmailTemplate = require("../utils/otpEmailTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtp = async (email, name, otp) => {
  const info = await transporter.sendMail({
    from: `From, <${process.env.SENDER}>`,
    to: email,
    subject: "Account verification OTP",
    html: otpEmailTemplate(name, otp),
  });

  return true;
};

module.exports = sendOtp;
