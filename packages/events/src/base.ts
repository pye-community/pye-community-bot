export interface BaseEvent {
  name: string
  run: (...args: any[]) => Promise<void> | void
}
