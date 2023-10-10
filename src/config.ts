import dotenv from 'dotenv';
dotenv.config();
const { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = process.env;

if (!CLIENT_ID || !DISCORD_TOKEN || !GUILD_ID) {
  throw new Error('Missing environment variables');
}

const config = {
  bot: {
    CLIENT_ID,
    DISCORD_TOKEN,
    GUILD_ID,
  },

  /**
   * TODO: change it, since this bot should be agnostic and not have any server configuration
   */

  channels: {
    challenges_channel: ['1141493769699606528'],
    reports_channel: '1145160830741135470',
  },
};

export default config;
