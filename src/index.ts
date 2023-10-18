import { client } from '~/context/client'
import { events } from '~/events'
import { env } from '~/utils/env'

async function start() {
  /**
   * Register events.
   */

  for (const event of events)
    client.on(event.name, event.run.bind(event))

  /**
   * Login to Discord.
   */

  await client.login(env.DISCORD_SECRET)
}

start()
