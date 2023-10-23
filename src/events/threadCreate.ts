import { Events, ThreadChannel } from 'discord.js';
import { PyeClient } from '..';
import { shareThreads } from '../modules/bot/functions/shareThread';
import { cohereAIHandler } from '../modules/bot/functions/threadsAi';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(pyeClient: PyeClient, thread: ThreadChannel) {
    await cohereAIHandler(thread);
    await shareThreads(pyeClient, thread);
  },
};
