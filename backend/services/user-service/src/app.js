import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import userRouter from "./interface/routes/auth.routes.js";

export const app = createExpressApp({
    serviceName: "Auth Service",
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
    ],
    enableSentry: true,
});
