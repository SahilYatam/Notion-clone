// const errorHandler = (err, req, res, next) => {
//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//         errors: err.errors || [],
//         data: err.data || null,
//         stack: process.env.NODE_ENV === "development" ?
//         err.stack : undefined,
//     });
// };

import logger from "../../../shared/utils/logger.js";

// In globalErrorHandler.js
export const errorHandler = (err, req, res, next) => {
    // Check if response was already sent
    if (res.headersSent) {
        return next(err);
    }
    
    logger.error(err.message, {
        stack: err.stack
    })
    // Your error handling logic
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

// Catches 404 routes
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        errors: [],
        data: null,
    })
}