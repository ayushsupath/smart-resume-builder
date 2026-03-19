const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: `"Smart Resume Builder" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to Smart Resume Builder! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #6366f1;">Welcome aboard, ${userName}!</h2>
          <p>We're thrilled to have you join Smart Resume Builder. Your journey to landing your dream job starts here.</p>
          <p><strong>Tips to get started:</strong></p>
          <ul>
            <li>Create your first resume using our ATS-friendly templates.</li>
            <li>Use the "AI Improve" feature to refine your professional summary and experience.</li>
            <li>Check your resume's "ATS Score" before applying to ensure maximum visibility.</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>The Smart Resume Builder Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendApplicationEmail = async (userEmail, jobTitle, company) => {
  try {
    const mailOptions = {
      from: `"Smart Resume Builder" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Application Submitted - ${jobTitle} at ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10b981;">Application Successful! 🎉</h2>
          <p>This is a confirmation that your application for the <strong>${jobTitle}</strong> position at <strong>${company}</strong> has been successfully tracked.</p>
          <p>Fingers crossed! 🤞 Be sure to keep an eye on your inbox for interview requests.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>The Smart Resume Builder Team</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Application email sent to ${userEmail} for ${jobTitle} at ${company}`);
  } catch (error) {
    console.error('Error sending application email:', error);
  }
};

module.exports = { sendWelcomeEmail, sendApplicationEmail };
