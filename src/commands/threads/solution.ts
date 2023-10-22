/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { ChatInputCommandInteraction } from 'discord.js';
import { CommandBuilder } from './../../modules/bot/handlers';

export const data = new CommandBuilder()
  .setName('solucionado')
  .setDescription('Gestiona los canales de ayuda')
  .setCategory('channels')
  .setOwnerOnly(true)
  .setCooldown(0);

export async function execute(
  interaction: ChatInputCommandInteraction<'cached'>
) {
  await interaction.reply({ content: 'pong', ephemeral: true });
}
