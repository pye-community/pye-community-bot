import type { ChatInputCommandInteraction } from 'discord.js'
import type { BaseCommand } from '../base'

export class ConfigCommand implements BaseCommand {
  name = 'config'

  async run(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('pong!')
  }
}

export const ConfigSchema = {
  name: 'config',
  name_locatizations: {
    'es-ES': 'configuración',
  },

  description: 'Manage the configuration.',
  description_localizations: {
    'es-ES': 'Gestiona la configuración.',
  },
}
