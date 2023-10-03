// const { Events } = require('discord.js');
import { Client, Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.displayName ?? client.user?.username ?? 'Unknown'}`);
    },
};
