import { events } from '@pye-community-bot/events'
import { env } from '@pye-community-bot/env'
import { client } from '~/client'

async function start() {
  // Events
  for (const event of events)
    client.on(event.name, event.run.bind(event))

  // Login
  await client.login(env.DISCORD_SECRET)
}

start()
