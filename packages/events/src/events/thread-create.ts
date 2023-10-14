import type { ThreadChannel } from 'discord.js'
import { Events } from 'discord.js'
import type { BaseEvent } from '../base'

export class ThreadCreateEvent implements BaseEvent {
  name = Events.ThreadCreate

  async run(thread: ThreadChannel) {
    // eslint-disable-next-line no-console
    console.log('Thread created', thread.guild.id, thread.name)
  }
}