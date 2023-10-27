import cohere from 'cohere-ai';
import { ChannelType, ThreadChannel } from 'discord.js';
import { translate } from 'google-translate-api-x';
import config from '../config';

export const cohereAIHandler = async (thread: ThreadChannel) => {
  if (typeof thread.parentId !== 'string') return;
  if (config.channels.challenges_channel.includes(thread.parentId)) return;
  if (thread.parent?.type !== ChannelType.GuildForum) return; 
  
  
  const { COHERE_AI_API_KEY } = process.env;
  if (!COHERE_AI_API_KEY) {
    console.warn(
      'COHERE_AI_API_KEY is not set, the AI will not work until api key is set'
    );
    return;
  }
  cohere.init(COHERE_AI_API_KEY);

  const result = thread.messages.cache.first() ??
    await thread.messages.fetch({ limit: 1 }).then(msgs => msgs.first()) ?? 
    await thread.fetchStarterMessage() ?? null;
    
  if (!result || (result.content == '' && result.attachments.first())) return;
     
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

  const body = response.body;
  if (!body.generations || body.generations.length == 0) return;
  const translated = await translate(body.generations[0].text, {
    to: 'es',
  });
      
  // TODO: change it
  const attachedMsg = `\n\n<@${result.author.id}> Recuerda que esto es solo una proximación para tu ayuda, aún puedes esperar que otros usuarios te respondan`;
  await thread.send(`${translated.text} ${attachedMsg}`);
      
  
  
};
