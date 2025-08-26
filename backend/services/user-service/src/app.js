import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import userRouter from "./interface/routes/user.routes.js";
import userSettingsRouter from "./interface/routes/userSettings.routes.js";

export const app = createExpressApp({
    serviceName: "User Service",
    routes: [
        {
            path: "/api/v1/user",
            router: userRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 50,
            }
        },
        {
            path: "/api/v1/user-settings",
            router: userSettingsRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 200,
            }
        },
    ],
    enableSentry: true,
});
