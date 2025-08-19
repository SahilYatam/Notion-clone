import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import workspaceRouter from "./interface/routes/workspace.routes.js";

export const app = createExpressApp({
    serviceName: "Workspace Service",
    routes: [
        {
            path: "/api/v1/user",
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
