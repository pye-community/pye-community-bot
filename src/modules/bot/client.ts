import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import config from '../../config';
import { SlashCommand, clientHandlers } from './handlers';

export default class PYECommunityClient extends Client {
  constructor(options?: ClientOptions) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel],
      allowedMentions: { parse: ['roles', 'users'] },
      ...options,
    });
  }

  config: typeof config = config;
  handler: clientHandlers = new clientHandlers(this);
  commands: Collection<string, SlashCommand> = new Collection<
    string,
    SlashCommand
  >();
  cooldowns: Collection<string, Collection<string, number>> = new Collection<
    string,
    Collection<string, number>
  >();

  public async login(token?: string | undefined): Promise<string> {
    Promise.all([
      this.handler.loadEvents().catch(console.error),
      this.handler.loadSlashCommands().catch(console.error),
    ]).catch(console.error);

    const client = await super.login(token);
    await this.handler
      .registerSlashCommands(this.commands.map(c => c))
      .catch(console.error);

    return client;
  }
}
