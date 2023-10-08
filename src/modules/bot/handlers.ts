import {
  AutocompleteInteraction,
  ClientEvents,
  Collection,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import config from '../../config';
import PYECommunityClient from './client';

interface slashCommandData
  extends RESTPostAPIChatInputApplicationCommandsJSONBody {
  category: string;
  developer?: boolean;
  ownerOnly?: boolean;
  guildOnly?: boolean;
  cooldown?: number;
}

export interface SlashCommand {
  data: slashCommandData;
  execute: (
    interaction: CommandInteraction,
    client?: PYECommunityClient
  ) => void;
  autocomplete?: (
    interaction: AutocompleteInteraction,
    client?: PYECommunityClient
  ) => void;
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

  async checkCommandPermissions(interaction: CommandInteraction) {
    const command = this.client.commands.get(interaction.commandName);

    if (!command) return;
    const embed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setDescription(
        '### 🔒 ***`Lo sentimos, pero no tienes permisos para usar este comando.`***'
      );

    if (
      command.data.developer &&
      !config.users.developers.includes(interaction.user.id)
    )
      return interaction.reply({ embeds: [embed], ephemeral: true });
    if (
      command.data.ownerOnly &&
      !config.users.owners.includes(interaction.user.id)
    )
      return interaction.reply({ embeds: [embed], ephemeral: true });
    if (command.data.guildOnly && !interaction.guildId)
      return interaction.reply({ embeds: [embed], ephemeral: true });
    if (command.data.cooldown) {
      if (!this.client.cooldowns.has(command.data.name))
        this.client.cooldowns.set(command.data.name, new Collection());

      const now = Date.now();
      const timestamps = this.client.cooldowns.get(command.data.name);
      const cooldownAmount = (command.data?.cooldown ?? 5) * 1000;

      if (timestamps?.has(interaction.user.id)) {
        const expirationTime =
          (timestamps.get(interaction.user.id) as number) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(
                  `### 🔒 ***\`Por favor, espera ${timeLeft.toFixed(
                    1
                  )} segundos antes de volver a usar el comando.\`***`
                ),
            ],
            ephemeral: true,
          });
        }
      }

      timestamps?.set(interaction.user.id, now);
      setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);
    }

    return false;
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

export class CommandBuilder extends SlashCommandBuilder {
  /**
   * The category option for the command.
   */
  category: string;

  /**
   * The developer option for the command.
   */
  developer: boolean;
  /**
   * The ownerOnly option for the command.
   */
  ownerOnly: boolean;
  /**
   * The guildOnly option for the command.
   */
  guildOnly: boolean;
  /**
   * The cooldown option for the command.
   */
  cooldown: number;

  constructor() {
    super();
    this.category = 'utilidad';
    this.developer = false;
    this.ownerOnly = false;
    this.guildOnly = false;
    this.cooldown = 5;
  }

  /**
   * Sets the category option for the command.
   * @param {string} value - The value to set.
   * @returns {CommandBuilder}
   */

  setCategory(value: string): CommandBuilder {
    this.category = value;
    return this;
  }

  /**
   * Sets the developer option for the command.
   * @param {boolean} value - The value to set.
   * @returns {CommandBuilder}
   */

  setDeveloper(value = true): CommandBuilder {
    this.developer = value;
    return this;
  }

  /**
   * Sets the ownerOnly option for the command.
   * @param {boolean} value - The value to set.
   * @returns {CommandBuilder}
   */

  setOwnerOnly(value = true): CommandBuilder {
    this.ownerOnly = value;
    return this;
  }

  /**
   * Sets the guildOnly option for the command.
   * @param {boolean} value - The value to set.
   * @returns {CommandBuilder}
   */

  setGuildOnly(value = true): CommandBuilder {
    this.guildOnly = value;
    return this;
  }

  /**
   * Sets the cooldown option for the command.
   * @param {number} value - The value to set.
   * @returns {CommandBuilder}
   */

  setCooldown(value: number): CommandBuilder {
    this.cooldown = value;
    return this;
  }

  /**
   * Serialices this command into a JSON object.
   * @returns {slashCommandData}
   */

  toJson(): slashCommandData {
    const data = super.toJSON() as slashCommandData;

    return {
      ...data,
      developer: this.developer,
      ownerOnly: this.ownerOnly,
      guildOnly: this.guildOnly,
      cooldown: this.cooldown,
    };
  }
}
