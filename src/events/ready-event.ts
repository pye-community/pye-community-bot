import { Events } from 'discord.js'

import type { Client } from 'discord.js'
import type { BaseEvent } from '~/utils/base'

/**
 * Ready event.
 * This event is triggered when the client is ready.
 */

export class ReadyEvent implements BaseEvent {
  name = Events.ClientReady

  run(client: Client) {
    // eslint-disable-next-line no-console
    console.log(`Logged in as ${client.user?.tag}!`)
  }
}
