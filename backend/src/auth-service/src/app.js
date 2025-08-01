import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cron from "node-cron"
import { sessionService } from "./domain/services/session.service.js";

import { errorHandler, notFoundHandler } from "./middlewares/globalErrorHandler.js";
import logger from "./utils/logger.js";


const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Body parsers

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});

// Error Handling
app.use(errorHandler);
app.use(notFoundHandler);

cron.schedule("0 0 * * *", async () => {
    logger.info("⏰ Running session cleanup job...");
    await sessionService.clearExpireSession();
});

// Routes
import authRouter from "./interface/routes/auth.routes.js";
import sessionRouter from "./interface/routes/session.routes.js";

app.use("/api/v1/auth", limiter, authRouter);
app.use("/api/v1/session", limiter, sessionRouter);

export { app };
