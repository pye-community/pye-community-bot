import { type BaseInteraction, Events } from 'discord.js'
import { commands } from '@pye-community-bot/commands'
import type { BaseEvent } from '../base'

export class InteractionCreateEvent implements BaseEvent {
  name = Events.InteractionCreate

  async command(interaction: BaseInteraction) {
    if (!interaction.isCommand())
      return

    const command = commands.find(cmd => cmd.name === interaction.commandName)

    if (!command)
      return

    await command.run(interaction)
  }

  async run(interaction: BaseInteraction) {
    if (!interaction.isCommand())
      return

    await this.command(interaction)
  }
}
