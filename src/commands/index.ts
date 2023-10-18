import type { BaseCommand } from '~/utils/base'
import { PingCommand, PingSchema } from '~/commands/ping-command'

export const commands: BaseCommand[] = [
  new PingCommand(),
]

export const schema = [
  PingSchema,
]
