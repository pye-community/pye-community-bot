export interface BaseCommand {
  name: string

  run: (...args: any[]) => Promise<void> | void
}

export interface BaseEvent {
  name: string

  run: (...args: any[]) => Promise<void> | void
}
