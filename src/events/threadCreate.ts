import { Events, ThreadChannel } from 'discord.js';
import { cohereAIHandler } from './handlers/cohereAIHandler';

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(thread: ThreadChannel) {
    await cohereAIHandler(thread);
  },
};
