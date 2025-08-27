import mongoose from "mongoose";
import logger from "../../../../../shared/utils/logger.js";

export const connectDB = async () => {
  let maxRetries = 5;
  let retryDelay = 5000; // ms

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        logger.info(`MongoDB connected to ${conn.connection.host}`);
        return;
    } catch (error) {
        logger.error(`MongoDB connection attempt ${attempt} failed`, {
            error: error.message,
            attempt: attempt,
            maxRetries: maxRetries,
            stack: error.stack,
        });

        if(attempt === maxRetries) {
            logger.error("All MongoDB connection attempts failed. Exiting...");
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

