import { Client, Events, Interaction } from 'discord.js';

import { loader } from '../index';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction, client: Client) {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    const slashCommand = (await loader)!.commands.get(commandName);
    console.log(slashCommand);
    slashCommand?.execute(interaction, client);
  },
};
