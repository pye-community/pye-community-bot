import config from './config';
import PYECommunityClient from './modules/bot/client';

export const client = new PYECommunityClient();

client.login(config.bot.DISCORD_TOKEN).catch(console.error);
