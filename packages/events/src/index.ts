import { InteractionCreateEvent } from './events/interaction-create-event'
import { MessageCreateEvent } from './events/message-create'
import { ReadyEvent } from './events/ready-event'
import { ThreadCreateEvent } from './events/thread-create'

import type { BaseEvent } from './base'

export const events: BaseEvent[] = [
  new InteractionCreateEvent(),
  new MessageCreateEvent(),
  new ReadyEvent(),
  new ThreadCreateEvent(),
]
