import dotenv from "dotenv";
dotenv.config();

import logger from "../../shared/utils/logger.js";
import { alertingService } from "../../shared/errorMonitoring/alertingService.js";
import {app} from "./app.js"
import connectDatabase, { disconnectDatabase } from "./infrastructure/db/db.js"
import { redis } from "./infrastructure/db/redisDb.js";


const serviceName = "Auth-Service";
let httpServer;
let prisma;

const server = async () => {
  let port = process.env.PORT || 8000;

  try {
    logger.info(`🔌 Connecting DB for ${serviceName}...`);
    prisma = await connectDatabase(process.env.DATABASE_URL);

    // raw query for health check
    await prisma.$queryRaw`SELECT NOW()`;
    await redis.connect()

    logger.info(`✅ PostgreSQL connection established for ${serviceName}`);

    httpServer = app.listen(port, () => {
      logger.info(`${serviceName} running on PORT: ${port}`);
    });
  } catch (error) {
    logger.error(`❌ Failed to start ${serviceName}: ${error.message}`);
    process.exit(1)
  }

  process.on("uncaughtException", async (error) => {
    await handleFataError("uncaughtException", error);
  });

  process.on("unhandledRejection", async (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await handleFataError("unhandledRejection", error);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  
};

const handleFataError = async (type, error) => {
    logger.error(`🚨 ${type.toUpperCase()} in ${serviceName}: ${error.message}`);
    logger.error(error.stack);

    try {
        await alertingService.sendCriticalAlert(error, {
            severity: "critical",
            service: serviceName,
        })
    } catch (err) {
        logger.error(`❌ Failed to send alert: ${err.message}`);
    }

    await gracefulShutdown(type);
}

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