import { Client, Partials, GatewayIntentBits } from 'discord.js';
import config from './config';
import { loadSlashCommands } from './slash-commands-loader';
import { loadEvents } from './events-loader';

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Message, Partials.Channel],
});

const slashCommands = loadSlashCommands();
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
	const slashCommand = slashCommands.get(commandName);
	slashCommand?.execute(interaction, client);
});

loadEvents(client);

client.login(config.DISCORD_TOKEN);
