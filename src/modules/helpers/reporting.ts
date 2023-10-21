import { EmbedBuilder, Message } from 'discord.js';
import { PyeClient } from '../..';
import config from '../../config';

export async function report(
  pyeClient: PyeClient,
  message: Message,
  url: string
) {
  const reportChannel = await pyeClient.discordClient.channels.fetch(
    config.channels.reports_channel
  );

  const displayName =
    message.member!.displayName ??
    message.author.displayName ??
    message.author.username;

  if (reportChannel?.isTextBased()) {
    await reportChannel.send({
      embeds: [
        new EmbedBuilder().setColor(0xff0000)
          .setDescription(`# NSFW Filter triggered\n**By:** ${displayName} (${message.author.id})
        **In:** <#${message.channel.id}> (${message.channel.id})
        **Content:** ***[Image](${url})***
          `),
      ],
    });
  }
}
