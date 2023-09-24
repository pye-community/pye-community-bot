import { Client, Message, EmbedBuilder } from 'discord.js'
import * as nsfwjs from 'nsfwjs'
import * as tf from '@tensorflow/tfjs-node'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const { REPORT_CHANNEL } = process.env

let model: nsfwjs.NSFWJS
nsfwjs.load().then((r) => (model = r))

export const nsfwFilter = async function (
  message: Message,
  client: Client
): Promise<void> {
  if (!message.member?.joinedAt) return

  if ((new Date().getTime() - message.member.joinedAt.getTime()) / 60000 > 10) return // > 10 minutes ? dont check
  if (message.attachments.size === 0) return
  for (const attachment of message.attachments) {
    const url = attachment[1]?.url
    if (!url) break

    let response = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    const imageBuffer: Buffer = response.data

    const img = tf.node.decodeImage(imageBuffer, 3) as any // There is a version type problem betweem nsfwjs and tfjs, that's the reason of 'any'
    const prediction = await model.classify(img)

    if (['Porn', 'Sexy'].includes(prediction[0].className)) {
      message.delete()
      if (REPORT_CHANNEL) {
        const reportChannel = client.channels.cache.get('1144840299630313582')
        if (reportChannel?.isTextBased()) {
          reportChannel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('NSFW filter triggered')
                .addFields({ name: 'at', value: `<#${message.channelId}>` })
                .addFields({ name: 'by', value: `${message.member} - ${message.member.id}` })
                .addFields({ name: 'nsfw content', value: url }),
            ],
          })
        }
      }
      break
    }
  }
}
