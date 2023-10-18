import { Events } from 'discord.js'
import type { Message } from 'discord.js'

import { classification } from '~/context/imp/computer-vision-imp'
import type { BaseEvent } from '~/utils/base'

export class MessageCreateEvent implements BaseEvent {
  name = Events.MessageCreate

  async run(message: Message) {
    if (message.author.bot)
      return

    const attachment = message.attachments.first()

    if (!attachment)
      return

    const response = await fetch(attachment.url)

    if (!response.ok)
      return

    const data = await response.arrayBuffer()
    const result = await classification(new Uint8Array(data), 'nsfw')

    if (result)
      await message.delete()
  }
}
