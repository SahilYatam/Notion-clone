import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import pageRouter from "./interface/routers/page.routes.js";

export const app = createExpressApp({
    serviceName: "Notes Service",
    routes: [
        {
            path: "/api/v1/page",
            router: pageRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 2000,
            }
        },
    ],

    enableSentry: true,
});
