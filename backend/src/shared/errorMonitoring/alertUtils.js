import os from "os";
import logger from "../../shared/utils/logger.js";


export const prepareAlertData = function (error, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    environment: this.config.environment,
    appName: this.config.appName,
    errorMessage: error.message,
    errorStack: error.stack,
    errorName: error.name,
    severity: context.severity || "critical",
    service: context.service || "unknown",
    userId: context.userId || null,
    requestId: context.requestId || null,
    additionalData: context.additionalData || {},
    serverInfo: {
      hostname: os.hostname(),
      platform: process.platform,
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    },
  };
};

export const handleAlertResults = function (results) {
  const failed = results.filter((result) => result.status === "rejected");
  const succeeded = results.filter((result) => result.status === "fulfilled");

  logger.info(
    `📊 Alert Summary: ${succeeded.length} succeeded, ${failed.length}`
  );

  if (failed.length > 0) {
    logger.error("❌ Some alerts failed:");

    failed.forEach((result, index) => {
      logger.error(`${index + 1}. ${result.reason.message}`);
    });
  }
};
