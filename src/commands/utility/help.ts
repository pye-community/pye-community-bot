import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Responde con una lista de comandos');

export function execute(interaction: CommandInteraction, client: Client) {}
