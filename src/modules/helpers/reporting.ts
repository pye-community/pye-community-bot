import { Colors, CommandInteraction, EmbedBuilder, Message } from 'discord.js';
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

export async function reportError(
  pyeClient: PyeClient,
  message: CommandInteraction,
  error: Error
) {
  const reportChannel = await pyeClient.discordClient.channels.fetch(
    config.channels.errors_channel
  );

  if (reportChannel?.isTextBased()) {
    await reportChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('Error')
          .addFields({ name: 'at', value: `<#${message.channelId}>` })
          .addFields({ name: 'command', value: message.commandName })
          .addFields({
            name: 'by',
            value: `${message.member?.user.username ?? ''} - ${
              message.member?.user.id ?? ''
            }`,
          })
          .addFields({ name: 'error', value: error.message })
          .addFields({
            name: 'stack',
            value: `\`\`\`${error.stack ?? ''}\`\`\``,
          }),
      ],
    });
  }
}
