export const INVITE_USER_TO_WORKSPACE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Workspace Invitation</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <table align="center" width="600" style="background: #ffffff; padding: 20px; border-radius: 8px;">
      <tr>
        <td style="text-align: center;">
          <h2 style="color: #333;">You've Been Invited!</h2>
          <p style="font-size: 16px; color: #555;">
            Hello,  
            You’ve been invited to join the workspace <strong>{{workspaceName}}</strong> on <strong>[App Name]</strong>.
          </p>
          <p style="font-size: 16px; color: #555;">
            Role Assigned: <strong>{{role}}</strong>
          </p>
          <p style="margin: 30px 0;">
            <a href="{{inviteLink}}" style="background: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px;">
              Accept Invitation
            </a>
          </p>
          <p style="font-size: 14px; color: #888;">
            If you didn’t expect this invitation, you can ignore this email.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

`