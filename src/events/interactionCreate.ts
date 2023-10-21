import { checkCommandPermissions } from '@/bot/handlers';
import { Colors, Events, Interaction } from 'discord.js';
import { PyeClient, client } from '..';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(pyeClient: PyeClient, interaction: Interaction) {
    if (interaction.isStringSelectMenu()) {
      const slashCommand = client?.commands.get(interaction.customId);
      if (!slashCommand) return;

      slashCommand?.interactions?.(interaction, client);
    }

    if (interaction.isAutocomplete()) {
      const slashCommand = client?.commands.get(interaction.commandName);
      if (!slashCommand) return;

      slashCommand?.autocomplete?.(interaction, client);
    }

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

    if (await checkCommandPermissions(client, interaction)) return;
    slashCommand?.execute(interaction, client);
  },
};
