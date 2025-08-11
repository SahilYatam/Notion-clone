import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

export function initSentry(app) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            new Tracing.Integrations.Express({ app }),
        ],
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV || "development",
    })
}

export { Sentry }