import dotenv from "dotenv";
dotenv.config();

import logger from "../../utils/logger.js";

let httpServer;
let currentServiceName;
let currentDisconnectDatabase;
let isShuttingDown = false;


export const createServer = async (app, port, serviceName, DB_URI, connectDatabase, disconnectDatabase) => {

  currentServiceName = serviceName;
  currentDisconnectDatabase = disconnectDatabase;

  try {
    logger.info(`🔌 Connecting DB for ${serviceName}...`);

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
    if(!isShuttingDown) {
        await handleFatalError("uncaughtException", error);
    }
  });

  process.on("unhandledRejection", async (reason) => {
    if(!isShuttingDown){
        const error = reason instanceof Error ? reason : new Error(String(reason));
        await handleFatalError("unhandledRejection", error);
    }
  });

  process.once("SIGINT", () => gracefulShutdown("SIGINT"));
  process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
  
};

const handleFatalError = async (type, error) => {
  if(isShuttingDown) return;

  logger.error(`🚨 ${type.toUpperCase()} in ${currentServiceName}: ${error.message}`);
  logger.error(error.stack);
  await gracefulShutdown(type);
};

const gracefulShutdown = async (signal) => {
    if(isShuttingDown){
        logger.info("Shutdown already in progress, ignoring signal");
        return;
    }

    isShuttingDown = true;
    logger.info(`🛑 ${currentServiceName} shutting down (${signal})...`);

    try {
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
        
        if(currentDisconnectDatabase) {
            await currentDisconnectDatabase();
        }
    
        logger.info(`✅ ${serviceName} shutdown complete`);
        process.exit(0);
    } catch (error) {
        logger.error(`Error during shutdown: ${error.message}`);
        process.exit(1);
    }
}

