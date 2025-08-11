import Joi from 'joi';

export const createSessionSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.base': 'User ID must be a string',
    'string.uuid': 'User ID must be a valid UUID',
    'any.required': 'User ID is required',
  }),

  refreshToken: Joi.string().min(20).required().messages({
    'string.base': 'Refresh token must be a string',
    'string.empty': 'Refresh token cannot be empty',
    'string.min': 'Refresh token must be at least 20 characters',
    'any.required': 'Refresh token is required',
  }),

  ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required().messages({
    'string.ip': 'IP Address must be a valid IPv4 or IPv6 address',
    'any.required': 'IP Address is required',
  }),

  userAgent: Joi.string().max(512).required().messages({
    'string.base': 'User Agent must be a string',
    'string.max': 'User Agent cannot exceed 512 characters',
    'any.required': 'User Agent is required',
  }),

  tokenExpireAt: Joi.date().greater('now').required().messages({
    'date.base': 'Token expiry must be a valid date',
    'date.greater': 'Token expiry must be a future date',
    'any.required': 'Token expiry date is required',
  }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().min(20).required().messages({
    'string.base': 'Refresh token must be a string',
    'string.empty': 'Refresh token cannot be empty',
    'string.min': 'Refresh token must be at least 20 characters',
    'any.required': 'Refresh token is required',
  }),
});

const getUserSessionsSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.base': 'User ID must be a string',
    'string.uuid': 'User ID must be a valid UUID',
    'any.required': 'User ID is required',
  }),
});

export const sessionValidation = {
    createSessionSchema,
    refreshTokenSchema,
    getUserSessionsSchema
}
