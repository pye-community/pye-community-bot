import type { Message } from 'discord.js'
import { Events } from 'discord.js'
import type { BaseEvent } from '../base'

export class MessageCreateEvent implements BaseEvent {
  name = Events.MessageCreate

  async run(message: Message) {
    if (message.author.bot)
      return

    // eslint-disable-next-line no-console
    console.log('Message created', message.id)
  }
}
