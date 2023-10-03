import { Client, ClientEvents } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

interface Event {
    name: keyof ClientEvents;
    once: boolean;
    execute: (...args: any[]) => void;
}

/** @link https://discordjs.guide/creating-your-bot/event-handling.html#individual-event-files */
export const loadEvents = async (client: Client) => {
    const eventsPath = path.join(__dirname, '../../events');
    const eventsFiles = readdirSync(`${eventsPath}`).filter((file) => file.match(/\.(ts|js)$/));
    for (const eventFile of eventsFiles) {
        const event = (await import(`${eventsPath}/${eventFile}`)) as Event;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};
