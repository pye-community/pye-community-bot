import { Client, GatewayIntentBits, Partials } from 'discord.js';
import config from './config';
import { clientHandlers } from './modules/bot/handlers';

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

export const loader = new clientHandlers(client)
  .loadSlashCommands()
  .then(async (a) => {
    return await a.loadEvents();
  })
  .catch((err) => {
    console.error(err);
  });

client.login(config.bot.DISCORD_TOKEN).catch((err) => {
  console.error(err);
});
