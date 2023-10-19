import { Events } from 'discord.js';
import { client } from '..';

export default {
  name: Events.ClientReady,
  once: true,
  execute(pyeClient: typeof client) {
    console.log(
      `Ready! Logged in as ${
        client.discordClient.user?.displayName ??
        client.discordClient.user?.username ??
        'Unknown'
      }`
    );
  },
};
