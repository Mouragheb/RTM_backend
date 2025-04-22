const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendVerificationEmail = async (user, baseUrl) => {
  const token = jwt.sign({ id: user._id }, process.env.EMAIL_SECRET, { expiresIn: '1d' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const url = `${baseUrl}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Verify Your Email - Restaurant Task Manager',
    html: `<p>Hello ${user.name},</p>
           <p>Click the link below to verify your email:</p>
           <a href="${url}">${url}</a>`,
  });
};

module.exports = sendVerificationEmail;