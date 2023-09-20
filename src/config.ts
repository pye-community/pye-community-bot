import dotenv from "dotenv";
dotenv.config();
const { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = process.env;

if (!CLIENT_ID || !DISCORD_TOKEN || !GUILD_ID ) {
  throw new Error("Missing environment variables");
}

const config = {
  CLIENT_ID,
  DISCORD_TOKEN,
  GUILD_ID
}

export default config