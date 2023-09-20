import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("replies with pong");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("pong!");
}
