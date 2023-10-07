import { Events, Message } from 'discord.js';
import PYECommunityClient from 'modules/bot/client';
import { nsfwFilter } from '../modules/utils/nsfwFilter';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message, client: PYECommunityClient) {
    if (message.author.bot) return;

    await nsfwFilter(message, client);
  },
};
