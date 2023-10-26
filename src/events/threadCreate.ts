
import { Events, ThreadChannel } from "discord.js";
import { PyeClient } from "..";
import { shareThreads } from "#/bot/functions/shareThread";
import { cohereAIHandler } from "#/bot/functions/threadsAi";
import { reportEventError } from "#/helpers/reporting";

export default {
  name: Events.ThreadCreate,
  once: false,
  async execute(pyeClient: PyeClient, thread: ThreadChannel) {
    try {
      await shareThreads(pyeClient, thread);
      await cohereAIHandler(thread);
    } catch (error) {
      await reportEventError(pyeClient,thread, error as Error);
    }
  },
};
