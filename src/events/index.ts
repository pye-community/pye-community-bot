import type { BaseEvent } from '~/utils/base'

import { InteractionCreateEvent } from '~/events/interaction-create-event'
import { MessageCreateEvent } from '~/events/message-create'
import { ReadyEvent } from '~/events/ready-event'
import { ThreadCreateEvent } from '~/events/thread-create'

export const events: BaseEvent[] = [
  new InteractionCreateEvent(),
  new MessageCreateEvent(),
  new ReadyEvent(),
  new ThreadCreateEvent(),
]
