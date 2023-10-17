import type { ChatInputCommandInteraction } from 'discord.js'
import type { BaseCommand } from '~/utils/base'

/**
 * Ping command.
 * A simple command that replies with pong!
 */

export class PingCommand implements BaseCommand {
  name = 'ping'

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('pong!')
  }
}

/**
 * Ping command schema.
 * This is used by the slash command builder to register the command.
 */

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
