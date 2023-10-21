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
    errors_channel: '1145160830741135470',
  },
  users: {
    owners: ['341077056026705930', '254720311717658624'],
    developers: ['401845716991082496', '852588734104469535'],
  },
  commands: {
    defaultcooldown: 5,
  },
  nsfw: {
    model: 'Falconsai/nsfw_image_detection',
    target: {
      id: '780597611496865792', // rol novato
    },
    threshold: 0.8,
  },
};

export default config;
