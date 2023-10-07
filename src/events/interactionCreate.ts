import { Colors, Events, Interaction } from 'discord.js';
import PYECommunityClient from 'modules/bot/client';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: PYECommunityClient) {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    const slashCommand = client.commands.get(commandName);
    if (!slashCommand)
      return interaction.reply({
        embeds: [
          { description: '### Este comando no existe', color: Colors.Red },
        ],
      });
    slashCommand?.execute(interaction, client);
  },
};
