/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { ChatInputCommandInteraction, Colors } from 'discord.js';
import { inspect } from 'util';
import { CommandBuilder } from './../../modules/bot/handlers';

export const data = new CommandBuilder()
  .setName('eval')
  .setDescription('Evalúa un código de JavaScript')
  .setCategory('desarrollador')
  .setOwnerOnly(true)
  .addStringOption(option =>
    option
      .setName('code')
      .setDescription('El código a evaluar')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName('depth')
      .setDescription('La profundidad de la evaluación')
      .setMaxValue(3)
      .setMinValue(0)
      .setRequired(false)
  )
  .addBooleanOption(option =>
    option
      .setName('secret')
      .setDescription('Si el código es secreto')
      .setRequired(false)
  )
  .setCooldown(0);

export async function execute(
  interaction: ChatInputCommandInteraction<'cached'>
) {
  const code = interaction.options.getString('code', true),
    depth = interaction.options.getNumber('depth'),
    secret = interaction.options.getBoolean('secret');

  try {
    let result = eval(code) as unknown;
    if (
      result instanceof Promise &&
      typeof result.then == 'function' &&
      typeof result.catch == 'function'
    )
      result = await result;

    interaction
      .reply({
        embeds: [
          {
            description: `## 📦 **\`Entrada\`**\n\`\`\`js\n${code}\n\`\`\`\n## 📤 **\`Salida\`**\n\`\`\`js\n${inspect(
              result,
              !!secret,
              depth ?? 0
            )}\n\`\`\``,
            color: Colors.Green,
          },
        ],
        ephemeral: !!secret,
      })
      .catch(console.error);
  } catch (error: any) {
    interaction
      .reply({
        embeds: [
          {
            description: `## 📦 **\`Entrada\`**\n\`\`\`js\n${code}\n\`\`\`\n## 📤 **\`Salida\`**\n\`\`\`fix\n${error.message}\n\`\`\``,
            color: Colors.Red,
          },
        ],
        ephemeral: !!secret,
      })
      .catch(console.error);
  }
}
