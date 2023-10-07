import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
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

  handler: clientHandlers = new clientHandlers(this);
  commands: Collection<string, SlashCommand> = new Collection();

  public async login(token?: string | undefined): Promise<string> {
    await this.handler.loadSlashCommands();
    await this.handler.loadEvents();

    return await super.login(token);
  }
}
