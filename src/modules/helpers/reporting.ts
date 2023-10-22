import { Colors, EmbedBuilder, Message } from 'discord.js';
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

  if (reportChannel?.isTextBased()) {
    await reportChannel.send({
      embeds: [
        new EmbedBuilder().setColor(Colors.Red)
          .setDescription(`# NSFW Filter triggered\n**By:** <@!${message.author.id}> (${message.author.id})
        **In:** <#${message.channel.id}> (${message.channel.id})
        **Content:** ***[Image](${url})***
          `),
      ],
    });
  }
}
