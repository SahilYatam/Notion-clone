import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import { sessionService } from "./domain/services/session.service.js";

import authRouter from "./interface/routes/auth.routes.js";
import sessionRouter from "./interface/routes/session.routes.js";

export const app = createExpressApp({
    serviceName: "Auth Service",
    routes: [
        {
            path: "/api/v1/auth",
            router: authRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 50,
            }
        },
        {
            path: "/api/v1/session",
            router: sessionRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 50,
            }
        }
    ],

    cronJobs: [
        {
            schedule: "0 0 * * *",
            task: async () => {
                logger.info("⏰ Running session cleanup job for auth service...");
                await sessionService.clearExpireSession()
            },
            name: "Daily Auth Cleanup",
        }
    ],

    enableSentry: true,
});
