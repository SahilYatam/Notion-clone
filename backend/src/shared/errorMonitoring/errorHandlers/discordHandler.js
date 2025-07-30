import axios from "axios";
import logger from "../../../shared/utils/logger.js"

export const sendDiscordAlert = async function(alertData){
  try {
    const embed = {
      title: `🚨 Critical Error Alert`,
      description: `**${alertData.errorName}**: ${alertData.errorMessage}`,
      color: 15158332, // Red color
      fields: [
        {
          name: "🏷️ Environment",
          value: alertData.environment,
          inline: true,
        },
        {
          name: "⚙️ Service",
          value: alertData.service,
          inline: true,
        },
        {
          name: "🖥️ Server",
          value: alertData.serverInfo.hostname,
          inline: true,
        },
        {
          name: "📊 Memory Usage",
          value: `${Math.round(
            alertData.serverInfo.memory.heapUsed / 1024 / 1024
          )}MB`,
          inline: true,
        },
        {
          name: "⏱️ Uptime",
          value: `${Math.round(alertData.serverInfo.uptime / 60)} minutes`,
          inline: true,
        },
      ],

      timestamp: alertData.timestamp,
      footer: {
        text: alertData.appName,
      },
    };

    // Add stack trace in a separate field if it exists
    if (alertData.errorStack) {
      embed.fields.push({
        name: "📋 Stack Trace (truncated)",
        value: `\`\`\`js\n${alertData.errorStack.substring(0, 1000)}\n\`\`\``,
        inline: false,
      });
    }

    await axios.post(this.config.discord.webhookUrl, {
      embeds: [embed],
    });

    logger.info("✅ Discord alert sent successfully");
  } catch (error) {
    logger.error("❌ Failed to send Discord alert:", error.message);
    throw error;
  }
};