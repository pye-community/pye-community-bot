/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { Colors, CommandInteraction } from 'discord.js';
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

export async function execute(interaction: CommandInteraction) {
  const code = interaction.options.get('code')?.value as string,
    depth = interaction.options.get('depth')?.value as number,
    secret = interaction.options.get('secret')?.value as boolean;

  try {
    let result = eval(code) as unknown;
    if (
      result instanceof Promise &&
      typeof result.then == 'function' &&
      typeof result.catch == 'function'
    )
      result = await result;

    await interaction.reply({
      embeds: [
        {
          description: `## 📦 **\`Entrada\`**
          \`\`\`js\n${code}\`\`\`
          \n## 📤 **\`Salida\`**
          \`\`\`js\n${inspect(result, !!secret, depth ?? 0)}
          \`\`\``,
          color: Colors.Green,
        },
      ],
      ephemeral: !!secret,
    });
  } catch (error: any) {
    await interaction.reply({
      embeds: [
        {
          description: `## 📦 **\`Entrada\`**
          \`\`\`js${code}\`\`\`
          \n## 📤 **\`Salida\`**
          \`\`\`fix\n${error.message}
          \`\`\``,
          color: Colors.Red,
        },
      ],
      ephemeral: !!secret,
    });
  }
}
