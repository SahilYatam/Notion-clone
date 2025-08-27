import dotenv from "dotenv";

dotenv.config();

import { app } from "./app.js";
import { connectDB } from "./infrastructure/db/db.js";

import mongoose from "mongoose";

import logger from "../../../shared/utils/logger.js";

let httpServer;
let currentServiceName = "Notion-Service";
let isShuttingDown = false;
let port = process.env.PORT || 8003;

const server = async () => {
  try {
    logger.info(`🔌 Connecting DB for ${currentServiceName}...`);

    await connectDB();

    logger.info(`✅ MongoDB connection established for ${currentServiceName}`);

    httpServer = app.listen(port, () => {
      logger.info(`${currentServiceName} running on PORT: ${port}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to start ${currentServiceName}: ${error.message}`);
    process.exit(1);
  }

  process.on("uncaughtException", async (error) => {
    await handleFatalError("uncaughtException", error);
  });

  process.on("unhandledRejection", async (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await handleFatalError("unhandledRejection", error);
  });

  process.once("SIGINT", () => gracefulShutdown("SIGINT"));
  process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

const handleFatalError = async (type, error) => {
  if (isShuttingDown) return;

  logger.error(
    `🚨 ${type.toUpperCase()} in ${currentServiceName}: ${error.message}`
  );
  logger.error(error.stack);
  await gracefulShutdown(type);
};

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) {
    logger.info("Shutdown already in progress, ignoring signal");
    return;
  }

  isShuttingDown = true;
  logger.info(`🛑 ${currentServiceName} shutting down (${signal})...`);

  try {
    if (httpServer) {
      await new Promise((resolve) => {
        httpServer.close((err) => {
          if (err) {
            logger.error(`Error closing server: ${err.message}`);
          }
          resolve();
        });
      });
      logger.info("🛑 HTTP server closed");
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      logger.info("🔌 MongoDB connection closed");
    }

    logger.info(`✅ ${currentServiceName} shutdown complete`);
    process.exit(0);
  } catch (error) {
    logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};

server();
