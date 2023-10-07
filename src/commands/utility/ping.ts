import {
  Client,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('replies with pong');

export async function execute(interaction: CommandInteraction, client: Client) {
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
