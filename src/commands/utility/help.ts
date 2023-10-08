import { AutocompleteInteraction, Colors, CommandInteraction, EmbedBuilder } from 'discord.js';
import PYECommunityClient from '../../modules/bot/client';
import { CommandBuilder } from '../../modules/bot/handlers';

export const data = new CommandBuilder()
  .setName('help')
  .setDescription('Responde con una lista de comandos')
  .addStringOption(option =>
    option
      .setName('comando')
      .setDescription('El comando a buscar')
      .setAutocomplete(true)
  )
  .addStringOption(option =>
    option
      .setName('categoria')
      .setDescription('La categoria a buscar')
      .setAutocomplete(true)
  )
  .setCooldown(10);

export function execute(
  interaction: CommandInteraction,
  client: PYECommunityClient
) {
  const embed = new EmbedBuilder().setDescription('# Ayuda').setColor(Colors.Blue);
}

export async function autocomplete(
  interaction: AutocompleteInteraction,
  client: PYECommunityClient
) {
  if (interaction.options.get('categoria'))
    await interaction.respond(
      client.commands.map(command => command.data.category).filter((x, i, a) => a.indexOf(x) == i).map(category => {
        return {
          name: category.slice(0, 1)
            .toUpperCase()
            .concat(category.slice(1)),
          value: category
        };
      })
    );

  await interaction.respond(
    client.commands
      .filter(x =>
        x.data.name.startsWith(
          interaction.options.get('comando')?.value?.toString() ?? ''
        )
      )
      .map(command => {
        return {
          name: command.data.name.slice(0, 1)
            .toUpperCase()
            .concat(command.data.name.slice(1)),
          value: command.data.name
        };
      })
  );
}
