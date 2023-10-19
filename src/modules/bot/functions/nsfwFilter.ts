import * as tf from '@tensorflow/tfjs-node';
import axios from 'axios';
import { EmbedBuilder, Message } from 'discord.js';
import dotenv from 'dotenv';
import * as nsfwjs from 'nsfwjs';
import { client } from '../../..';
import config from '../../../config';
dotenv.config();

let model: nsfwjs.NSFWJS;
nsfwjs
  .load()
  .then(r => (model = r))
  .catch(err => console.log(err));

const thresholds = {
  Porn: 0.4,
  Sexy: 0.6,
  Hentai: 0.6,
};

const keys = ['Porn', 'Sexy', 'Hentai'];

export const nsfwFilter = async function (
  message: Message,
  pyeClient: typeof client
): Promise<void> {
  if (!message.member) return;
  if (message.attachments.size === 0) return;
  if (!message.member?.roles.cache.find(r => r.id === '1058280838900486165'))
    return;

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

    for (const casualty of prediction) {
      const name = casualty.className;
      if (
        keys.includes(name) &&
        casualty.probability >= thresholds[name as keyof typeof thresholds]
      ) {
        await message.delete();
        report(pyeClient, message, url).catch(err => console.log(err));

        return;
      }
    }
  }
};

async function report(pyeClient: typeof client, message: Message, url: string) {
  const reportChannel = await pyeClient.discordClient.channels.fetch(
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
            value: `${message.member?.displayName ?? ''} - ${
              message.member?.id ?? ''
            }`,
          })
          .addFields({ name: 'nsfw content', value: url }),
      ],
    });
  }
}
