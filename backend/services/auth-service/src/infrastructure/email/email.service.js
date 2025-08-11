import logger from "../../../../../shared/utils/logger.js";

import { transporter } from "./email.config.js";
import { EMAIL_VERIFY_TEMPLATE } from "./templates/emailVerify.template.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./templates/resetPassword.templates.js";

const injectTemplateVariables = (template, variables) => {
    let result = template;
    for(const [key, value] of Object.entries(variables)){
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return result;
}

const sendVerifyEmail = async (email, code) => {
  try {

    const html = injectTemplateVariables(EMAIL_VERIFY_TEMPLATE, {
        OtpCode: code
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email Address",
      html
    });
  } catch (err) {
    logger.error("Error while sending verification email", {message: err.message, stack: err.stack, email});
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  try {

    const html = injectTemplateVariables(PASSWORD_RESET_REQUEST_TEMPLATE, {
         reset_link: resetLink
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html
    });
  } catch (err) {
    logger.error("Error while sending password reset email", {
        message: err.message, stack: err.stack, email
    });
  }
};

const sendPasswResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Was Successfully Changed",
      html
    });
  } catch (err) {
    logger.error("Error while sending password reset email", {
        message: err.message, stack: err.stack, email
    });
  }
};

export const emailService = {
    sendVerifyEmail,
    sendPasswordResetEmail,
    sendPasswResetSuccessEmail
}