import express from "express";

import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cron from "node-cron"


import { initSentry, Sentry } from "./infrastructure/sentry/sentry.js";
import { sessionService } from "./domain/services/session.service.js";
import { errorHandler, notFoundHandler } from "./middlewares/globalErrorHandler.js";
import logger from "../../shared/utils/logger.js";

import authRouter from "./interface/routes/auth.routes.js";
import sessionRouter from "./interface/routes/session.routes.js";


const app = express();

// Initialize sentry
initSentry(app);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Security and middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});

app.use("/api/v1/auth", limiter, authRouter);
app.use("/api/v1/session", limiter, sessionRouter);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler());

// Error Handling
app.use(errorHandler);
app.use(notFoundHandler);

// CRON Job
cron.schedule("0 0 * * *", async () => {
    logger.info("⏰ Running session cleanup job...");
    await sessionService.clearExpireSession();
});

export { app };
