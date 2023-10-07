import {
  Client,
  ClientEvents,
  CommandInteraction,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import config from '../../config';
import PYECommunityClient from './client';

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction, client?: Client) => void;
}

export interface Event {
  name: keyof ClientEvents;
  once: boolean;
  execute: (...args: any[]) => void;
}

export class clientHandlers {
  client: PYECommunityClient;

  constructor(client: PYECommunityClient) {
    this.client = client;
  }

  async loadSlashCommands(dir: string = 'commands') {
    const basePath = join(
      process.cwd(),
      process.argv.includes('dev') ? 'src' : 'build'
    );
    const files = readdirSync(join(basePath, dir));

    for (const file of files) {
      const filePath = join(basePath, dir, file);
      const stat = lstatSync(filePath);

      if (stat.isDirectory()) {
        await this.loadSlashCommands(join(dir, file));
        continue;
      }

      if (!/\.(ts|js)$/.test(file)) continue;
      const command = (await import(filePath)) as SlashCommand;
      this.client.commands.set(command.data.name, command);
    }
    return this;
  }

  async registerSlashCommands(commands: SlashCommand[]) {
    const rest = new REST({ version: '9' }).setToken(config.bot.DISCORD_TOKEN);
    await rest
      .put(
        Routes.applicationGuildCommands(
          config.bot.CLIENT_ID,
          config.bot.GUILD_ID
        ),
        { body: commands.map(command => command.data) }
      )
      .then(() => console.log('Successfully registered application commands.'))
      .catch(console.error);
  }

  async loadEvents(dir: string = 'events') {
    const basePath = join(
      process.cwd(),
      process.argv.includes('dev') ? 'src' : 'build'
    );
    const files = readdirSync(join(basePath, dir));
    for (const file of files) {
      const filePath = join(basePath, dir, file);
      const stat = lstatSync(filePath);

      if (stat.isDirectory()) {
        await this.loadEvents(join(dir, file)).catch(console.error);
        continue;
      }

      if (!/\.(ts|js)$/.test(file)) continue;
      const event = (await import(filePath)) as { default: Event };
      if (!event.default) continue;
      const { name, once, execute } = event.default;

      (once ? this.client.once : this.client.on).call(
        this.client,
        name,
        execute.bind(null, this.client)
      );
    }

    return this;
  }
}
