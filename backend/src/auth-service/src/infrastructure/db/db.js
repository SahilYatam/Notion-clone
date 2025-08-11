import { PrismaClient } from "@prisma/client";
import logger from "../../../../shared/utils/logger.js";

let prisma;
let isConnecting = false;

const connectDatabase = async (dbURI) => {
  if (!dbURI) {
    const error = new Error("PostgreSQL URI is missing");
    logger.error("❌ PostgreSQL URI is missing.");
    throw error;
  }

  if(prisma) {
    logger.info("Database already connected, reusing existing connection");
    return prisma;
  }

  isConnecting = true;
  let maxRetries = 5;
  let retryDelay = 5000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: dbURI,
          },
        },

        log: [
          { level: "warn", emit: "event" },
          { level: "info", emit: "event" },
          { level: "error", emit: "event" },
        ],
        // Connection pool optimization
        __internal: {
            engine: {
                connectionTimeout: 30000,
                maxIdleTime: 600000,
            }
        }
      });

      await prisma.$connect();

      // Set up event listeners only once
      setupPrismaEventListeners()

      logger.info(`PostgreSQL connected successfully`, {
        attempt: attempt,
        database: "Connected via Prisma",
      });

      
      return prisma;
    } catch (error) {
      logger.error(`PostgreSQL connection attempt ${attempt} failed`, {
        error: error.message,
        attempt: attempt,
        maxRetries: maxRetries,
        stack: error.stack,
      });

      // Disconnect if connection was partially established
      if (prisma) {
        await prisma.$disconnect();
        prisma = null;
      }

      // Exit the process after max attempts
      if (attempt === maxRetries) {
        logger.error("All PostgreSQL connection attempts failed. Exiting...");
        throw error;
      }

      logger.info(`Retrying in ${retryDelay}ms...(${attempt}/${maxRetries})`);
      await sleep(retryDelay);
    }
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility function to get the Prisma client instance
const getPrismaClient = () => {
    if (!prisma) {
        // prisma = new PrismaClient();
        
        // // Connect immediately
        // prisma.$connect().catch((error) => {
        //     logger.error("Failed to connect to database:", error);
        //     throw new Error("Database not connected. Call connectDatabase() first.");
        // });
        throw new Error("Database not connected. Call connectDatabase() first.");
    }
    return prisma;
}

// Set up Prisma event listeners (called only once)
const setupPrismaEventListeners = () => {
    if (!prisma) return;

    prisma.$on("warn", (e) => {
        logger.warn(`⚠️ Prisma warning: ${e.message}`);
    });

    prisma.$on("info", (e) => {
      logger.info(`ℹ️ Prisma info: ${e.message}`);
    });

    prisma.$on("error", (e) => {
       logger.error(`❌ Prisma error: ${e.message}`);
    });

}

// Graceful shutdown function
const disconnectDatabase = async () => {
  if (prisma) {
    try {
      await prisma.$disconnect();
      logger.info("✅ Database disconnected successfully");
    } catch (error) {
      logger.error(`❌ Error disconnecting from database: ${error.message}`);
    } finally {
      prisma = null;
    }
  }
};

export { prisma }
export default connectDatabase;
export { disconnectDatabase }


