import { Client, GatewayIntentBits, Partials } from 'discord.js'
import { env } from '~/utils/env'

function clientSingleton() {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel],
    allowedMentions: { parse: ['users'] },
  })
}

type ClientSingleton = ReturnType<typeof clientSingleton>

const globalForClient = globalThis as unknown as {
  client: ClientSingleton | undefined
}

export const client = globalForClient.client ?? clientSingleton()

if (env.NODE_ENV !== 'production')
  globalForClient.client = client
