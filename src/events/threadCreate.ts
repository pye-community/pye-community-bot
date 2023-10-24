import { cohereAIHandler } from '#/bot/functions/threadsAi';
import { Events, ThreadChannel } from 'discord.js';
import { PyeClient } from '..';
import { shareThreads } from '#/bot/functions/shareThread';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(pyeClient: PyeClient, thread: ThreadChannel) {
    await cohereAIHandler(thread);
    await shareThreads(pyeClient, thread);
  },
};
