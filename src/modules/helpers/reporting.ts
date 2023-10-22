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
        new EmbedBuilder().setColor(Colors.Red)
          .setDescription(`# NSFW Filter triggered\n**By:** <@!${message.author.id}> (${message.author.id})
        **In:** <#${message.channel.id}> (${message.channel.id})
        **Content:** ***[Image](${url})***
          `),
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
        new EmbedBuilder().setDescription(`# Error Triggered\n
        **By:** <@!${ message.member?.user.id ?? ''}> (${message.member?.user.id ?? ''}
        **At:** <#${message.channel?.id ?? ''}>
        **Command:** ${message.commandName}
        **Error:** ${error.message}
        **Stack:** \`\`\`${error.stack ?? ''}\`\`\``).setColor(Colors.Red),
      ],
    });
  }
}
