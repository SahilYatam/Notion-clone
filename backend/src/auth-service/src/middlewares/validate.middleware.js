import { StatusCodes } from "http-status-codes";
import logger from "../../../shared/utils/logger.js";

export const validateRequest = (schema, property = "body", joiOptions = {}) => {
  return (req, res, next) => {
    const defaultOptions = {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: { label: false },
      },
      ...joiOptions,
    };

    const {error, value} = schema.validate(req[property], defaultOptions);

    // If validation passes, replace req[property] with validated value
    // This ensures type coercion and default values are applied
    if(!error){
        req[property] = value;
        return next();
    }

    const errorDetails = error.details.map((detail) => ({
        path: detail.path.join("."),
        message: detail.message,
    }));

    logger.error(errorDetails)

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: "Validation error",
      errors: errorDetails,
    });

  };
};
