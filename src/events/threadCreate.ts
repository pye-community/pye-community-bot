import { Events } from 'discord.js';
import { ThreadChannel } from 'discord.js';
import { cohereAIHandler } from './handlers/cohereAIHandler';

module.exports = {
	name: Events.ThreadCreate,
	once: false,
	async execute(thread: ThreadChannel) {
		await cohereAIHandler(thread);
	},
};
