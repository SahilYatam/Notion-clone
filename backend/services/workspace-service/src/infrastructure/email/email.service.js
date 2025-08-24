import logger from "../../../../../shared/utils/logger.js";
import { INVITE_USER_TO_WORKSPACE } from "./email.template.js";

export const inviteUserToWorkspaceEmail = async (email, workspaceName, role, inviteLink) => {
  try {

    const htmlContent = INVITE_USER_TO_WORKSPACE
      .replace(/{{workspaceName}}/g, workspaceName)
      .replace(/{{role}}/g, role)
      .replace(/{{inviteLink}}/g, inviteLink);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Invitation from ${workspaceName}`,
      html: htmlContent
    });
  } catch (err) {
    logger.error("Error while sending verification email", {message: err.message, stack: err.stack, email});
  }
};