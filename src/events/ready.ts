// const { Events } = require('discord.js');
import { Events } from 'discord.js';
import PYECommunityClient from '../modules/bot/client';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: PYECommunityClient) {
    console.log(
      `Ready! Logged in as ${
        client.user?.displayName ?? client.user?.username ?? 'Unknown'
      }`
    );
  },
};
