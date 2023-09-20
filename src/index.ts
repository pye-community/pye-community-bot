import { Client } from "discord.js";
import config from './config';
import * as commandModules from './commands';
import { deployCommands } from "./deploy-commands";

deployCommands()

const commands = Object(commandModules)

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", () => {
  console.log("Bot ready");
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) {
    return
  }
  const { commandName } = interaction;
  commands[commandName].execute(interaction, client)
})


client.login(config.DISCORD_TOKEN)