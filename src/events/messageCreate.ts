import { Events, Message } from 'discord.js';
import { client } from '..';
import { nsfwFilter } from '../modules/bot/functions/nsfwFilter';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(pyeClient: typeof client, message: Message) {
    if (message.author.bot) return;

    await nsfwFilter(message, client);
  },
};
