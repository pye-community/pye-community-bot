import { Client, GatewayIntentBits, Interaction, Partials } from 'discord.js';
import config from './config';
import { loadEvents } from './modules/bot/eventsLoader';
import { loadSlashCommands } from './modules/bot/slashCommandsLoader';

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
    allowedMentions: { parse: ['users'] },
});

const slashCommands = loadSlashCommands();
client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const slashCommand = (await slashCommands).get(commandName);
    slashCommand?.execute(interaction, client);
});

loadEvents(client).catch((err) => {});
client.login(config.bot.DISCORD_TOKEN).catch((err) => {});
