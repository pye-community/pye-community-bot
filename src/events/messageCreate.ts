import { Client, Events, Message } from 'discord.js';
import { nsfwFilter } from '../modules/utils/nsfwFilter';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message, client: Client) {
    if (message.author.bot) return;

    await nsfwFilter(message, client);
  },
};
