import { Client, CommandInteraction } from 'discord.js';
import { CommandBuilder } from '../../modules/bot/handlers';

export const data = new CommandBuilder()
  .setName('help')
  .setDescription('Responde con una lista de comandos')
  .setCooldown(10);

export function execute(interaction: CommandInteraction, client: Client) {}
