export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 40px; color: #000;">
    <h2>Your Notion signup code is <strong>{{code}}</strong></h2>

    <div style="max-width: 600px; margin-top: 40px;">
      <h3 style="font-size: 20px; margin-bottom: 10px;">Sign up for Notion</h3>
      <p style="font-size: 14px; color: #333;">
        You can sign up by entering the code on the sign up page in Notion, or simply by clicking the magic link below.
      </p>

      <div style="margin: 20px 0; background-color: #f1f1f1; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 2px;">
        {{code}}
      </div>

      <a href="{{magicLink}}" style="display: block; text-align: center; background-color: #2563eb; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; width: 100%; max-width: 300px; margin: 0 auto;">
        Sign in with Magic Link
      </a>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
        <img src="{{logoUrl}}" alt="Notion Logo" width="24" height="24" style="vertical-align: middle; margin-right: 4px;" />
        <a href="{{websiteUrl}}" style="color: #555; text-decoration: none;">Notion.so</a>, the all-in-one workspace for your notes, tasks, and collaboration.
      </div>
    </div>
  </body>
</html>

`