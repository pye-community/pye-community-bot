import { nsfwFilter } from '#/bot/functions/nsfwFilter';
import { Events, Message } from 'discord.js';
import { PyeClient, client } from '..';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(pyeClient: PyeClient, message: Message) {
    if (message.author.bot) return;

    await nsfwFilter(message, client);
  },
};
