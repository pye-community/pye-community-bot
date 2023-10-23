import cohere from 'cohere-ai';
import { ChannelType, ThreadChannel } from 'discord.js';
import { translate } from 'google-translate-api-x';
import config from '../../../config';

export const cohereAIHandler = async (thread: ThreadChannel) => {
  if (typeof thread.parentId !== 'string') return;
  if (config.channels.challenges_channel.includes(thread.parentId)) return;

  if (thread.parent?.type == ChannelType.GuildForum) {
    const { COHERE_AI_API_KEY } = process.env;
    if (!COHERE_AI_API_KEY) {
      console.warn(
        'COHERE_AI_API_KEY is not set, the AI will not work until api key is set'
      );
      return;
    }
    cohere.init(COHERE_AI_API_KEY);

    await thread.fetchStarterMessage().then(async function (result) {
      if (!result) return;
      if (result.content == '' && result.attachments.first()) {
        await thread.sendTyping();
        await thread.send(
          'No puedo ayudarte si pones una imagen, por favor indica una descripción para poder ayudarte'
        );
      } else if (result.content !== '') {
        await thread.sendTyping();
        const response = await cohere.generate({
          model: 'command-light',
          prompt: result.content,
          max_tokens: 300,
          temperature: 0.9,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE',
        });

        const { generations } = response.body;
        const translated = await translate(generations[0].text, {
          to: 'es',
        });
        try {
          // TODO: change it
          const attachedMsg = `\n\n<@${result.author.id}> Recuerda que esto es solo una proximación para tu ayuda, aún puedes esperar que otros usuarios te respondan`;
          await thread.send(`${translated.text} ${attachedMsg}`);
        } catch (err) {
          console.log(err);
        }
      }
    });
  }
};
