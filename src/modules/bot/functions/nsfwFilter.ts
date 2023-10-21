import { report } from '@/helpers/reporting';
import { HfInference } from '@huggingface/inference';
import { Message } from 'discord.js';
import { PyeClient } from '../../../';
import config from '../../../config';

interface Response {
  label: string;
  score: number;
}

export async function nsfwFilter(
  message: Message,
  pyeClient: PyeClient
): Promise<void> {
  if (!message.member) return;
  if (message.attachments.size === 0) return;
  if (!config.bot.HF_SECRET) {
    console.error(
      'Warn: The HF_SECRET key is missing. To enable the NSFW filter, please provide the API key in the .env file.'
    );
    return;
  }
  if (!message.member || !message.member.joinedAt) return;
  // day lapse in milliseconds
  if ((Date.now() - message.member.joinedAt.getTime()) / 86400000 > 1) return;

  if (!message.member?.roles.cache.find(r => r.id === config.nsfw.target.id))
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
  const hf = new HfInference(config.bot.HF_SECRET);
  const data = await (await fetch(url)).arrayBuffer();

  if (!data) return false;

  const result = <Response[]>await hf.imageClassification({
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
