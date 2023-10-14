import type { ChatInputCommandInteraction } from 'discord.js'
import type { BaseCommand } from '../base'

export class PingCommand implements BaseCommand {
  name = 'ping'

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('pong!')
  }
}

export const PingSchema = {
  name: 'ping',
  name_locatizations: {
    'es-ES': 'ping',
  },

  description: 'Replies with pong!',
  description_localizations: {
    'es-ES': '¡Responde con pong!',
  },
}
