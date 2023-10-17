import type { BaseInteraction } from 'discord.js'
import { Events } from 'discord.js'

import type { BaseEvent } from '~/utils/base'
import { commands } from '~/commands'

/**
 * Interaction create event.
 * This event is triggered when a user interacts with a command.
 */

export class InteractionCreateEvent implements BaseEvent {
  name = Events.InteractionCreate

  async command(interaction: BaseInteraction): Promise<void> {
    if (!interaction.isCommand() || !interaction.guildId)
      return

    const command = commands.find(
      command => command.name === interaction.commandName,
    )

    if (!command)
      return

    await command.run(interaction)
  }

  async run(interaction: BaseInteraction): Promise<void> {
    if (interaction.isCommand())
      await this.command(interaction)
  }
}
