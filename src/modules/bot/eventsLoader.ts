import { Client, ClientEvents } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

interface Event {
  name: keyof ClientEvents;
  once: boolean;
  execute: (...args: any[]) => void;
}

/** @link https://discordjs.guide/creating-your-bot/event-handling.html#individual-event-files */
export const loadEvents = async (client: Client) => {
  const eventsPath = join(
    process.cwd(),
    process.argv.includes('dev') ? 'src' : 'build',
    'events'
  );
  const eventsFiles = readdirSync(eventsPath).filter((file) =>
    file.match(/\.(ts|js)$/)
  );

  for (const eventFile of eventsFiles) {
    const event = (await import(join(eventsPath, eventFile))) as {
      default: Event;
    };
    if (event.default.once) {
      client.once(event.default.name, (...args) =>
        event.default.execute(...args)
      );
    } else {
      client.on(event.default.name, (...args) =>
        event.default.execute(...args, client)
      );
    }
  }
};
