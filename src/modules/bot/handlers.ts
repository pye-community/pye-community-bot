import {
  Client,
  ClientEvents,
  Collection,
  CommandInteraction,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import config from '../../config';

export type SlashCommand = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction, client?: Client) => void;
};

interface Event {
  name: keyof ClientEvents;
  once: boolean;
  execute: (...args: any[]) => void;
}

export class clientHandlers {
  client: Client;
  commands: Collection<string, SlashCommand> = new Collection();

  constructor(client: Client) {
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
        return this;
      }

      if (!/\.(ts|js)$/.test(file)) continue;
      const command = (await import(filePath)) as SlashCommand;
      this.commands.set(command.data.name, command);
    }

    await this.registerSlashCommands(this.commands.map((command) => command));
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
        { body: commands.map((command) => command.data) }
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
        await this.loadEvents(join(dir, file));
        continue;
      }

      if (!/\.(ts|js)$/.test(file)) continue;
      const event = (await import(filePath)) as { default: Event };
      event.default.once
        ? this.client.once(event.default.name, (...args) =>
          event.default.execute(...args)
        )
        : this.client.on(event.default.name, (...args) =>
          event.default.execute(...args, this.client)
        );
    }

    return this;
  }
}
