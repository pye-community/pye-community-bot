import { Events } from 'discord.js';
import { PyeClient, client } from '..';

export default {
  name: Events.ClientReady,
  once: true,
  execute(pyeClient: PyeClient) {
    console.log(
      `Ready! Logged in as ${
        client.discordClient.user?.displayName ??
        client.discordClient.user?.username ??
        'Unknown'
      }`
    );
  },
};
