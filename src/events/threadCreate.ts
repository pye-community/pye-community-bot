import { Events, ThreadChannel } from 'discord.js';
import { PyeClient } from '..';
import { cohereAIHandler } from '../modules/bot/functions/threadsAi';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(pyeClient: PyeClient, thread: ThreadChannel) {
    await cohereAIHandler(thread);
  },
};
