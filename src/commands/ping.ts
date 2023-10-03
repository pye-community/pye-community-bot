import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('replies with pong');

export async function execute(interaction: CommandInteraction, client: Client) {
    await interaction.reply('pong!');
}
