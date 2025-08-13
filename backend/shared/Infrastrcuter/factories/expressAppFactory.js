import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cron from "node-cron";

import { initSentry, Sentry } from "../../error-monitoring/sentry/sentry.js";
import logger from "../../utils/logger.js";
import { errorHandler, notFoundHandler } from "../middleware/globalErrorHandler.js";

/**
 * @typedef {Object} RouteConfig
 * @property {string} path
 * @property {import('express').Router} router
 * @property {boolean} [useRateLimit]
 * @property {ReturnType<typeof rateLimit>} [customLimiter]
 */

/**
 * @typedef {Object} CronJobConfig
 * @property {string} schedule
 * @property {Function} task
 * @property {string} [name]
 */

/**
 * Create a configured Express app for a microservice
 */

export function createExpressApp ({
    serviceName,
    routes = [],
    cronJobs = [],
    rateLimiting = {windowMs: 15 * 60 * 1000, max: 100},
    enableSentry = true
}) {
    const app = express();

    // Common middleware
    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json({limit: "20kb"}));
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    // Rate limiter
    const limiter = rateLimit(rateLimiting);

    // Routes
    routes.forEach(({path, router, useRateLimit = true, customLimiter}) => {
        if (!router) return;
        
        const middlewares = [];
        if(useRateLimit){
            const rateLimitMiddleware = customLimiter ? rateLimit(customLimiter) : limiter;
            middlewares.push(rateLimitMiddleware);
        }
        middlewares.push(router);
        app.use(path, ...middlewares);

        logger.info(`✅ ${serviceName} registered route: ${path}`);
    });

    // 404 Error handler
    app.use(notFoundHandler);

    if(enableSentry) app.use(Sentry.expressErrorHandler());

    // Global Error handler
    app.use(errorHandler);

    // Cron jobs
    cronJobs.forEach(({ schedule, task, name }) => {
        cron.schedule(schedule, async() => {
            logger.info(`⏰ ${serviceName} running job: ${name || schedule}`);
            await task();
        });
    });

    return app;
}


