import { Events, Message } from 'discord.js';
import { PyeClient, client } from '..';
import { nsfwFilter } from '../functions/nsfwFilter';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(pyeClient: PyeClient, message: Message) {
    if (message.author.bot) return;

    await nsfwFilter(message, client);
  },
};
