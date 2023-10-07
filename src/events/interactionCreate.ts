import { Colors, Events, Interaction } from 'discord.js';
import PYECommunityClient from 'modules/bot/client';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: PYECommunityClient, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    const slashCommand = client?.commands.get(commandName);

    if (!slashCommand)
      return interaction.reply({
        embeds: [
          {
            description:
              '### 🔎 ***`Lo sentimos, pero no encontramos el comando.`***',
            color: Colors.Red,
          },
        ],
        ephemeral: true,
      });

    slashCommand?.execute(interaction, client);
  },
};
