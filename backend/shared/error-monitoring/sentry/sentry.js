import * as Sentry from "@sentry/node";
import logger from "../../utils/logger.js";
export function initSentry(app) {
    try {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                Sentry.expressIntegration({ app }),
            ],
            sendDefaultPii: true,
            tracesSampleRate: 1.0,
            environment: process.env.NODE_ENV || "development",
        })
    } catch (error) {
        logger.error("Failed to initialize Sentry:", error)
    }
}

export { Sentry }