import { Message } from 'discord.js'
import * as nsfwjs from 'nsfwjs'
import * as tf from '@tensorflow/tfjs-node'
import axios from 'axios'

let model: any

nsfwjs.load().then((r) => (model = r)) // todo, make it load once

/**
 * TODO: make it configurable
 * Roles
 * Amount of time since join at the server.
 * TODO : Add optional alert to channel when some message get deleted.
 */
export const nsfwFilter = async function (message: Message): Promise<void> {
  if (!message.member?.joinedAt) return

  if ((new Date().getTime() - message.member.joinedAt.getTime()) / 60000 > 10) return // > 10 minutes ? dont check
  if (message.attachments.size === 0) return
  for (const attachment of message.attachments) {
    if (!attachment[1].url) break

    let img = await axios.get(attachment[1].url, {
      responseType: 'arraybuffer',
    })

    img = tf.node.decodeImage(img.data, 3) as any
    const prediction = await model.classify(img)

    if (['Porn', 'Sexy'].includes(prediction[0].className)) {
      message.delete()
      break
    }
  }
}
