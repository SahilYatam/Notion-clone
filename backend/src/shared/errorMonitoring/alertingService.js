import { AlertingService } from "./errorAlertingService.js";

export const alertingService = new AlertingService({
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  enableDiscord: true, 

  environment: process.env.NODE_ENV || "development",
  appName: "Notion-clone"
})