exports.generateResetPasswordEmailTemplate = (name, email, resetLink, logoUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Password - CodeSync</title>
      <style>
        body {
          background-color: #f2f4f6;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.08);
          padding: 30px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          max-width: 120px;
          height: auto;
          margin-bottom: 10px;
        }
        .header h1 {
          color: #2D9CDB;
          margin: 0;
        }
        .content {
          line-height: 1.6;
          font-size: 16px;
        }
        .reset-button {
          display: inline-block;
          background-color: #2D9CDB;
          color: white;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999;
          text-align: center;
        }
        .footer a {
          color: #2D9CDB;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="CodeSync Logo" />
          <h1>CodeSync</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset the password for your CodeSync account associated with <strong>${email}</strong>.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="reset-button">Reset Password</a>
          </p>
          <p>This link will expire in 10 minutes for your security.</p>
          <p>If you didn’t request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} CodeSync. All rights reserved.</p>
          <p>Need help? Contact us at <a href="mailto:support@codesync.com">support@codesync.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
