import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import config from './config';
import {
  SlashCommand,
  loadEvents,
  loadSlashCommands,
  registerSlashCommands,
} from './modules/bot/handlers';

export const client = {
  config,
  handlers: {
    loadEvents,
    loadSlashCommands,
    registerSlashCommands,
  },
  commands: new Collection<string, SlashCommand>(),
  cooldowns: new Collection<string, Collection<string, number>>(),
  discordClient: new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
    allowedMentions: { parse: ['roles', 'users'] },
  }),
};

export type PyeClient = typeof client;

client.handlers.loadEvents(client).catch(console.error);
client.handlers.loadSlashCommands(client).then(() => {
  client.handlers
    .registerSlashCommands(client.commands.map(x => x))
    .catch(console.error);
}).catch(console.error);

client.discordClient.login(config.bot.DISCORD_TOKEN).catch(console.error);
