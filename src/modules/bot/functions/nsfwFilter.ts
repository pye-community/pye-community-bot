import { HfInference } from '@huggingface/inference';

import config from '../../../config';

const { HF_SECRET } = process.env;

import { EmbedBuilder, Message } from 'discord.js';
import { PyeClient } from '../../..';

interface Response { label: string, score: number }

export async function nsfwFilter(
  message: Message,
  pyeClient: PyeClient
): Promise<void> {
  if (!message.member) return;
  if (message.attachments.size === 0) return;
  if (!message.member || !message.member.joinedAt) return;
  // day lapse in milliseconds
  if (((new Date().getTime() - message.member.joinedAt.getTime()) / 86400000) > 1)
    return;

  if (!message.member?.roles.cache.find(r => r.id === '1058280838900486165'))
    return;

  for (const attachment of message.attachments) {
    const url = attachment[1]?.url;
    if (!url) break;

    const prediction = await predict(url);
    if (prediction) {
      await message.delete();
      report(pyeClient, message, url).catch(err => console.log(err));
      return;
    }
  }
}

async function predict(url: string): Promise<boolean> {
  const hf = new HfInference(HF_SECRET);
  const data = await (await fetch(url)).arrayBuffer();

  if (!data) return false;

  const result = <Response[]> await hf.imageClassification({
    data,
    model: config.nsfw.model,
  });

  const labels = result.filter(x => {
    const labels = x.label.split(', ');
    const unique = [...new Set(labels.map(y => y.toLowerCase()))];

    return unique.includes('nsfw');
  });

  if (!labels.length) return false;
  const score = Math.max(...labels.map(x => x.score));

  return score >= config.nsfw.threshold;
}

async function report(pyeClient: PyeClient, message: Message, url: string) {
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
