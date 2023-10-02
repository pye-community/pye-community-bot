// const { Events } = require('discord.js');
import { Events } from 'discord.js';

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: any) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
