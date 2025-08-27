import { createExpressApp } from "../../../shared/Infrastrcuter/factories/expressAppFactory.js";

import notesRouter from "./interface/routes/notes.routes.js";

export const app = createExpressApp({
    serviceName: "Notes Service",
    routes: [
        {
            path: "/api/v1/notes",
            router: notesRouter,
            useRateLimit: true,
            customLimiter: {
                windowMs: 15 * 60 * 1000,
                max: 2000,
            }
        },
    ],

    enableSentry: true,
});
