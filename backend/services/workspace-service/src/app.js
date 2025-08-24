import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import workspaceRouter from "../src/interface/routers/workspace.routes.js"

export const app = createExpressApp({
    serviceName: "Workspace Service",
    routes: [
        {
            path: "/api/v1/workspace",
            router: workspaceRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 200,
            }
        },
    ],
    enableSentry: true,
});
