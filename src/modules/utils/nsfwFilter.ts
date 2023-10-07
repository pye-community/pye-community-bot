import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import { Client, EmbedBuilder, Message } from 'discord.js';
import dotenv from 'dotenv';
import * as nsfwjs from 'nsfwjs';
import config from '../../config';
dotenv.config();

let model: nsfwjs.NSFWJS;
nsfwjs
  .load()
  .then(r => (model = r))
  .catch(err => console.log(err));

export const nsfwFilter = async function (
  message: Message,
  client: Client
): Promise<void> {
  if (!message.member) return;
  if (message.attachments.size === 0) return;
  for (const attachment of message.attachments) {
    const url = attachment[1]?.url;
    if (!url) break;

    let response = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = response.data as Buffer;

    const img = tf.node.decodeImage(imageBuffer, 3);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const prediction = await model.classify(img as any);

    if (!['Porn', 'Sexy'].includes(prediction[0].className)) return;
    await message.delete();

    const reportChannel = await client.channels.fetch(
      config.channels.reports_channel
    );

    if (reportChannel?.isTextBased()) {
      await reportChannel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('NSFW filter triggered')
            .addFields({ name: 'at', value: `<#${message.channelId}>` })
            .addFields({
              name: 'by',
              value: `${message.member.displayName} - ${message.member.id}`,
            })
            .addFields({ name: 'nsfw content', value: url }),
        ],
      });
    }
  }
};
