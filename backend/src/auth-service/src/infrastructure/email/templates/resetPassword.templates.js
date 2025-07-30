export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        margin-top: 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #888888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password. Click the button below to create a new one:</p>
      <a href="{{reset_link}}" class="button">Reset Password</a>
      <p>This link will expire in 15 minutes. If you didn’t request a password reset, please ignore this email.</p>
      <div class="footer">
        &copy; 2025 Notion-Clone. All rights reserved.
      </div>
    </div>
  </body>
</html>

`
export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Changed</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #888888;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Changed Successfully</h2>
      <p>Your password was successfully changed. If you did not make this change, please contact our support team immediately.</p>
      <p>We recommend reviewing your account activity and updating your security settings.</p>
      <div class="footer">
        &copy; 2025 Notion-Clone. All rights reserved.
      </div>
    </div>
  </body>
</html>

`