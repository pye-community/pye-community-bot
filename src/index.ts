import { Client } from "discord.js";
import config from "./config";
import { loadSlashCommands } from "./slash-commands-loader";
import { loadEvents } from "./events-loader";

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

const slashCommands = loadSlashCommands();
const commands = Object(slashCommands);
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client);
});

loadEvents(client)



client.login(config.DISCORD_TOKEN);
