import { Client, Events, Message } from 'discord.js';
import { nsfwFilter } from './handlers/nsfwFilter';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message, client: Client) {
    if (message.author.bot) return;
    if (!message.member?.roles.cache.find(r => r.name == "NOVATO《✯》")) return;

    await nsfwFilter(message, client);
  },
};
