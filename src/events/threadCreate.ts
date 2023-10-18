import { Events, ThreadChannel } from 'discord.js';
import PYECommunityClient from '../modules/bot/client';
import { cohereAIHandler } from '../modules/threads/ThreadsAi';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(client: PYECommunityClient, thread: ThreadChannel) {
    await cohereAIHandler(thread);
  },
};
