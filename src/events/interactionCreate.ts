import { Client, Events, Interaction } from 'discord.js';
import { loadSlashCommands } from '../modules/bot/slashCommandsLoader';

const slashCommands = loadSlashCommands();

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: Client) {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const slashCommand = (await slashCommands).get(commandName);
    slashCommand?.execute(interaction, client);
  },
};
