import { Events, ThreadChannel } from 'discord.js';
import { client } from '..';
import { cohereAIHandler } from '../modules/bot/functions/threadsAi';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(pyeClient: typeof client, thread: ThreadChannel) {
    await cohereAIHandler(thread);
  },
};
