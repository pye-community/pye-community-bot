import { Events, ThreadChannel } from 'discord.js';
import { cohereAiHandler } from './handlers/cohereAIHandler';

export default {
    name: Events.ThreadCreate,
    once: false,
    async execute(thread: ThreadChannel) {
        await cohereAiHandler(thread);
    },
};
