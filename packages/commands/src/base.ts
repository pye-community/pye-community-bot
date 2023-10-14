export interface BaseCommand {
  name: string
  run: (...args: any[]) => Promise<void> | void
}
