/**
 * Natural Language Processing
 * A set of functions that can be used to process text text classification, text generation, and more
 */

import { HfInference } from '@huggingface/inference'
import { env } from '~/utils/env'

/**
 * Assistants
 * A set of assistants that can be used to classify text based on a context
 */

const assistants = {
  engineering: [
    'Pregunta:',
  ],
}

type Assistant = keyof typeof assistants

/**
 * Generation
 * A function that generates text based on a prompt
 */

// WARNING: This function is not ready for production use
// This code is not functional at this time, it should be determined which model to use, its instructions and the surrounding code according to more developed clarifying policies, context, format and sentences.

// OPERATIONS: Add operational dependencies (huggingface/CodeBERTa-language-id), language determination, purist statement instructions and operational prefixes.

export async function generation(data: string, assistant: Assistant) {
  const hf = new HfInference(env.HUGGINGFACE_SECRET)

  const acl = assistants[assistant]

  if (!acl)
    return false

  let generated_text = `${acl.join('\n')}\n${data}\n|stop-sequence|\n`
  let completed = false

  while (!completed) {
    const result = await hf.textGeneration({
      model: 'EleutherAI/gpt-neox-20b',
      inputs: generated_text,
      parameters: {
        return_full_text: false,
        stop_sequences: ['|stop-sequence|'],
        max_new_tokens: 250,
        temperature: 0.8,
        max_time: 120,
      },
    })

    generated_text += result.generated_text

    if (generated_text === result.generated_text)
      completed = true

    if (generated_text.length > 2000)
      completed = true
  }

  generated_text = generated_text.slice(0, 2000)

  return generated_text
}
