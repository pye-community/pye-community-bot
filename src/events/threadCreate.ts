import { cohereAIHandler } from '@/bot/functions/threadsAi';
import { Events, ThreadChannel } from 'discord.js';
import { PyeClient } from '..';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(pyeClient: PyeClient, thread: ThreadChannel) {
    await cohereAIHandler(thread);
  },
};
