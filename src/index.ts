import {
  loadEvents,
  loadSlashCommands,
  registerSlashCommands,
  SlashCommand,
} from '#/bot/handlers';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import config from './config';
import { reportError } from '#/helpers/reporting';


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

process.on("uncaughtException", async (error: Error) => {
  await reportError({ client, error, typeLabel: "Uncaught Exception Error" });
});

process.on("unhandledRejection", async (error: Error) => {
  await reportError({ client, error, typeLabel: "Unhandled Rejection Error" });
});
