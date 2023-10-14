import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { env } from '@pye-community-bot/env'

const globalForClient = globalThis as unknown as { client: Client }

export const client
  = globalForClient.client
  || new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
    allowedMentions: { parse: ['users'] },
  })

if (env.NODE_ENV !== 'production')
  globalForClient.client = client
