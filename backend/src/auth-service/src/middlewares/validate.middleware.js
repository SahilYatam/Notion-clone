import { StatusCodes } from "http-status-codes";
import logger from "../../../shared/utils/logger.js";

const ALLOWED_PROPERTIES = ['body', 'query', 'params', 'headers', 'cookies'];

const DEFAULT_JOI_OPTIONS = {
  abortEarly: false,
  stripUnknown: true,
  errors: {
    wrap: { label: false },
  },
};

export const validateRequest = (schema, property = "body", joiOptions = {}) => {
  if (!schema || typeof schema.validate !== 'function') {
    throw new Error('Invalid schema: must be a Joi schema object');
  }

  if (!ALLOWED_PROPERTIES.includes(property)) {
    throw new Error(`Invalid property: ${property}. Must be one of: ${ALLOWED_PROPERTIES.join(', ')}`);
  }

  return (req, res, next) => {
    try {
      const validationOptions = { ...DEFAULT_JOI_OPTIONS, ...joiOptions };
      const dataToValidate = req[property] || {};
      const { error, value } = schema.validate(dataToValidate, validationOptions);

      if (!error) {
        req[property] = value;
        return next();
      }

      const errorDetails = error.details.map((detail) => ({
        path: detail.path.join("."),
        message: detail.message,
      }));

      logger.error("Validation failed", {
        property,
        path: req.path,
        method: req.method,
        errors: errorDetails,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Validation error",
        errors: errorDetails,
      });

    } catch (validationError) {
      logger.error("Unexpected error during validation", {
        property,
        path: req.path,
        method: req.method,
        error: validationError.message,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal validation error",
      });
    }
  };
};