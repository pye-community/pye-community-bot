import { ChannelType, Colors, EmbedBuilder, ThreadChannel } from 'discord.js';
import { PyeClient } from '..';
import config from '../config';
import { toCapitalize } from '../utils/text';

export const shareThreads = async (pyeClient: PyeClient,thread: ThreadChannel) => {
  if (typeof thread.parentId !== 'string') return;
  if (thread.parent?.type == ChannelType.GuildForum) {

    const forumChannel = thread.parent;
    if (config.shareThreads.forumTargets.includes(forumChannel.id)) {
      const reportChannel = await pyeClient.discordClient.channels.fetch(
        config.shareThreads.outputChannel.chat_programadores
      );
      if (reportChannel?.isTextBased()) {
        await reportChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(Colors.Blue)
              .setDescription(`
                :large_blue_diamond: <@${thread?.ownerId || 'Un usuario'}> ha creado una publicación en **${toCapitalize(forumChannel.name)}** : <#${thread.id}>, 
                > Si es una consulta y te agradecen obtendrás puntos de reputación por ayudar.
              `)
          ],
        });
      }
    }
  }
};
