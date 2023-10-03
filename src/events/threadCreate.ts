import { Events } from 'discord.js';
import { ThreadChannel } from 'discord.js';
import { cohereAiHandler } from './handlers/cohereAIHandler';

module.exports = {
    name: Events.ThreadCreate,
    once: false,
    async execute(thread: ThreadChannel) {
        await cohereAiHandler(thread);
    },
};
