const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
  },
});

/**
 * Send a generic email
 * @param {Object} options - { email, subject, message }
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // We don't throw here to prevent breaking the main flow,
    // but in production you might want more robust retry logic.
  }
};

/**
 * Send budget exceed notification
 * @param {string} email - User email
 * @param {string} categoryName - Category that exceeded budget
 * @param {number} limit - Budget limit
 * @param {number} spent - Current spent amount
 */
const sendBudgetExceedNotification = async (
  email,
  categoryName,
  limit,
  spent,
) => {
  const subject = `Budget Exceeded: ${categoryName}`;
  const message = `You have exceeded your budget for ${categoryName}. Limit: ${limit}, Current Spent: ${spent}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <h2 style="color: #d9534f;">Budget Alert!</h2>
      <p>Hello,</p>
      <p>This is to notify you that you have exceeded your budget for <strong>${categoryName}</strong>.</p>
      <ul>
        <li><strong>Budget Limit:</strong> $${limit}</li>
        <li><strong>Current Spending:</strong> $${spent}</li>
      </ul>
      <p>Please review your transactions to stay on track with your financial goals.</p>
      <p>Regards,<br/>Fisher Team</p>
    </div>
  `;

  return sendEmail({ email, subject, message, html });
};

module.exports = {
  sendEmail,
  sendBudgetExceedNotification,
};
