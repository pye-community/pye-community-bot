import { Client } from "discord.js";
import config from "./config";
import { deploySlashCommands } from "./deploy-commands";

const slashCommands = deploySlashCommands();
const commands = Object(slashCommands);

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Bot ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

client.login(config.DISCORD_TOKEN);
