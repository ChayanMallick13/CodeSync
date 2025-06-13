exports.generateOtpEmailTemplate = (otp, email, logoUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification - CodeSync</title>
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
        .otp-box {
          background-color: #eef7ff;
          color: #2D9CDB;
          font-size: 26px;
          letter-spacing: 4px;
          padding: 12px 24px;
          display: inline-block;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: bold;
        }
        .content {
          line-height: 1.6;
          font-size: 16px;
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
          ${logoUrl ? `<img src="${logoUrl}" alt="CodeSync Logo" />` : ''}
          <h1>CodeSync</h1>
          <p>Secure Your Account</p>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>You recently initiated a request to verify the email <strong>${email}</strong>.</p>
          <p>Please use the following One-Time Password (OTP) to complete the verification process:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p>If you did not initiate this request, you can safely ignore this message.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} CodeSync. All rights reserved.</p>
          <p>Need help? Contact us at <a href="mailto:support@codesync.com">support@codesync.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
