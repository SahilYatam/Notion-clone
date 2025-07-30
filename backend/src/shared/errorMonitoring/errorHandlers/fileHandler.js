import { promises as fs } from "fs";
import path from "path";
import logger from "../../utils/logger.js";

export const logToFile = async function (alertData) {
  try {
    const logEntry = {
      ...alertData,
      logLevel: "CRITICAL",
      source: "alerting-system",
    };

    const fileName = `critical-errors-${
      new Date().toISOString().split("T")[0]
    }.log`;
    const filePath = path.join(this.config.logging.logDirectory, fileName);

    const logLine = JSON.stringify(logEntry) + "\n";
    await fs.appendFile(filePath, logLine);

    logger.info(`✅ Alert logged to file: ${fileName}`);
  } catch (error) {
    logger.error("❌ Failed to log alert to file:", error.message);
    throw error;
  }
};

export const ensureLogDirectory = async function () {
  try {
    await fs.access(this.config.logging.logDirectory);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(this.config.logging.logDirectory, { recursive: true });
      logger.info(
        `📁 Created log directory: ${this.config.logging.logDirectory}`
      );
    }
  }
};
