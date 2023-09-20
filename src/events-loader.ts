import path from "path";
import { readdirSync } from "fs";
import { Client } from "discord.js";

/** @link https://discordjs.guide/creating-your-bot/event-handling.html#individual-event-files */
export const loadEvents = (client: Client) => {
  const eventsPath = path.join(__dirname, "events");
  const eventsFiles = readdirSync(`${eventsPath}`).filter((file) =>
    file.match(/\.(ts|js)$/)
  );
  for (const eventFile of eventsFiles) {
    const event = require(`${eventsPath}/${eventFile}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};
