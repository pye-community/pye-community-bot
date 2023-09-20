import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "./config";
import path from "path";
import { readdirSync } from "fs";

/** @link https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration */
export const loadSlashCommands = () => {
  const commands = [];
  const slashCommandsPath = path.join(__dirname, "commands");
  const slashCommandsFiles = readdirSync(`${slashCommandsPath}`).filter(
    (file) => file.match(/\.(ts|js)$/)
  );

  for (const slashCommandFile of slashCommandsFiles) {
    const slashCommandImported = require(`${slashCommandsPath}/${slashCommandFile}`);
    commands.push(slashCommandImported);
  }
  const commandsData = commands.map((command) => command.data);

  const rest = new REST({ version: "9" }).setToken(config.DISCORD_TOKEN);
  rest
    .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
      body: commandsData,
    })
    .then(() => {
      console.log("Succesfully registered application commands.");
    })
    .catch(console.error);

  return commands;
};
