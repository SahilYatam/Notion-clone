import Joi from "joi";

const creatAccountSchema = Joi.object({
    email: Joi.string().email({tlds: {allow: false}}).trim().lowercase().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty"
    }),
});

const verifyOtpSchema = Joi.object({
  otp: Joi.string()
    .trim().length(6).pattern(/^\d+$/).required()
    .messages({
      'string.base': 'OTP must be a string',
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits long',
      'string.pattern.base': 'OTP must contain only digits',
      'any.required': 'OTP is required'
    })
});

const validateCredentialsSchema = Joi.object({
    name: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Name is required",
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be at most 20 characters long",
    }),

    password: Joi.string().min(8).max(16).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$")).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at lease 8 characters long",
        "string.max": "Password cannot exceed 20 characters",
        "string.pattern.base": "Password must contain at least one latter and one number",
        "stringe.empty": "Password cannot be empty",
    })
})

const loginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty"
    }),

    password: Joi.string().min(8).max(16).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
    })
});

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "any.required": "Refresh token is required to logout",
        "string.empty": "Refresh token cannot be empty"
    })
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // disables TLD restriction like `.com` only
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
});

const resetPasswordSchema = Joi.object({
    password: Joi.string().pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"
    )).required()
    .messages({
      "string.pattern.base":
        "Password must be 8–30 characters, include uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),
});

const changePasswordSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Current password must be a string',
      'string.empty': 'Current password is required',
      'any.required': 'Current password is required',
    }),

  newPassword: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      'string.base': 'New password must be a string',
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters long',
      'string.max': 'New password cannot exceed 64 characters',
      'string.pattern.base': 'New password must include at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required',
    }),
});

export const authValidate = {
    creatAccountSchema, 
    verifyOtpSchema,
    validateCredentialsSchema,
    loginSchema,
    logoutSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
}