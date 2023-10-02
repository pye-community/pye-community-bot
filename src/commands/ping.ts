import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Client } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('replies with pong');

export function execute(interaction: CommandInteraction, client: Client) {
	interaction.reply('pong!');
}
