import { Events } from 'discord.js'
import type { Message } from 'discord.js'

import { predict } from '~/context/imp/vit-base-imp'
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
    const result = await predict(new Uint8Array(data), 'nsfw')

    if (result)
      await message.delete()
  }
}
