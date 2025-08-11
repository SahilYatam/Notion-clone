import dotenv from "dotenv";
dotenv.config();

import logger from "../../../shared/utils/logger.js";

import {app} from "./app.js"
import connectDatabase, { disconnectDatabase } from "./infrastructure/db/db.js"
import { redis } from "./infrastructure/db/redisDb.js";


const serviceName = "Auth-Service";
let httpServer;

const server = async () => {
  let port = process.env.PORT || 8000;

  try {
    logger.info(`🔌 Connecting DB for ${serviceName}...`);

    const DB_URI = process.env.DATABASE_URL;
    await connectDatabase(DB_URI);

    logger.info(`✅ PostgreSQL connection established for ${serviceName}`);

    httpServer = app.listen(port, () => {
      logger.info(`${serviceName} running on PORT: ${port}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to start ${serviceName}: ${error.message}`);
    process.exit(1)
  }

  process.on("uncaughtException", async (error) => {
    await handleFatalError("uncaughtException", error);
  });

  process.on("unhandledRejection", async (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await handleFatalError("unhandledRejection", error);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  
};

const handleFatalError = async (type, error) => {
  logger.error(`🚨 ${type.toUpperCase()} in ${serviceName}: ${error.message}`);
  logger.error(error.stack);
  await gracefulShutdown(type);
};

const gracefulShutdown = async (signal) => {
    logger.info(`🛑 ${serviceName} shutting down (${signal})...`);

    if(httpServer) {
        await new Promise((resolve) => {
            httpServer.close((err) => {
                if(err) {
                    logger.error(`Error closing server: ${err.message}`);
                }
                resolve();
            });
        });
        logger.info("🛑 HTTP server closed");
    };
    await disconnectDatabase();

    logger.info(`✅ ${serviceName} shutdown complete`);
    process.exit(0);
}

server();