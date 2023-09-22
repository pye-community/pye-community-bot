import { REST } from '@discordjs/rest'
import {
  Collection,
  CommandInteraction,
  SlashCommandBuilder,
  Client,
} from 'discord.js'

import { Routes } from 'discord-api-types/v9'
import config from './config'
import path from 'path'
import { readdirSync } from 'fs'

export type SlashCommand = {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction, client?: Client) => void
}

/** @link https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration */
export const loadSlashCommands = (): Collection<string, SlashCommand> => {
  const commands = new Collection<string, SlashCommand>()

  const slashCommandsPath = path.join(__dirname, 'commands')
  const slashCommandsFiles = readdirSync(`${slashCommandsPath}`).filter((file) =>
    file.match(/\.(ts|js)$/)
  )

  for (const slashCommandFile of slashCommandsFiles) {
    const slashCommandImported = require(`${slashCommandsPath}/${slashCommandFile}`)
    commands.set(slashCommandImported.data.name, slashCommandImported)
  }

  const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN)
  rest
    .put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
      body: commands.map((command: any) => command.data),
    })
    .then(() => {
      console.log('Succesfully registered application commands.')
    })
    .catch(console.error)
  return commands
}
