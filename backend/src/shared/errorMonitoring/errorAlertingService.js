import logger from "../../shared/utils/logger.js";

import { sendDiscordAlert } from "./errorHandlers/discordHandler.js";
import { logToFile, ensureLogDirectory } from "./errorHandlers/fileHandler.js";
import {
  prepareAlertData,
  handleAlertResults,
} from "./alertUtils.js";

class AlertingService {
  constructor(config = {}) {
    this.config = {

      discord: {
        webhookUrl: config.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL,
        enabled: config.enabledDiscord !== false,
      },

      logging: {
        logDirectory: config.logDirectory || "./logs",
        enabled: config.enabledLogging !== false,
      },

      environment: config.environment || process.env.NODE_ENV || "development",
      appName: config.appName || "Notion-Clone",
    };

    this.prepareAlertData = prepareAlertData.bind(this);
    this.sendDiscordAlert = sendDiscordAlert.bind(this);
    this.logToFile = logToFile.bind(this);
    this.ensureLogDirectory = ensureLogDirectory.bind(this);
    this.handleAlertResults = handleAlertResults.bind(this);

    if (this.config.logging.enabled) {
      this.ensureLogDirectory();
    }
  }

  // Main methos to send critical alerts to discord channel

  async sendCriticalAlert(error, context = {}) {
    const alertData = this.prepareAlertData(error, context);
    const promises = [];

    logger.error(`🚨 CRITICAL ALERT: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);

    if (this.config.discord.enabled && this.config.discord.webhookUrl) {
      promises.push(this.sendDiscordAlert(alertData));
    }

    if (this.config.logging.enabled) {
      promises.push(this.logToFile(alertData));
    }

    // Execute alearts and handle any failures
    const results = await Promise.allSettled(promises);
    this.handleAlertResults(results);

    return alertData;
  }
}

export { AlertingService };
