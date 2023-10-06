import { Client, GatewayIntentBits, Partials } from 'discord.js';
import config from './config';
import { loadEvents } from './modules/bot/eventsLoader';

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

loadEvents(client).catch((err) => {
  console.error(err);
});
client.login(config.bot.DISCORD_TOKEN).catch((err) => {
  console.error(err);
});
