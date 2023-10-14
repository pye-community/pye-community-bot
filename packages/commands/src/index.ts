import { ConfigCommand, ConfigSchema } from './commands/config-command'
import { PingCommand, PingSchema } from './commands/ping-command'

import type { BaseCommand } from './base'

export const commands: BaseCommand[] = [
  new ConfigCommand(),
  new PingCommand(),
]

export const schema = [
  ConfigSchema,
  PingSchema,
]
