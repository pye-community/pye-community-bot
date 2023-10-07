import { Colors, CommandInteraction, EmbedBuilder } from 'discord.js';
import PYECommunityClient from '../../modules/bot/client';
import { CommandBuilder } from '../../modules/bot/handlers';

export const data = new CommandBuilder()
  .setName('ping')
  .setDescription('replies with pong')
  .setCooldown(10);

export async function execute(
  interaction: CommandInteraction,
  client: PYECommunityClient
) {
  const time = Date.now();

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription('🎾 Tomando ping...')
        .setColor(Colors.Blue),
    ],
  });

  const ping = Date.now() - time;

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setDescription(
          `# 🏓 Pong! \n💬 Mensajes: **\`${ping}ms\`**\n 🔌 Gateway: **\`${client.ws.ping}ms\`**`
        )
        .setColor(Colors.Blue),
    ],
  });
}
