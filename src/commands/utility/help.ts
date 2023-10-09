import {
  AutocompleteInteraction,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
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

export async function execute(
  interaction: CommandInteraction,
  client: PYECommunityClient
) {
  const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/768329192131526686/1160655761639219262/3513b19499eea111db54cef4336f7b77.png?ex=653573e9&is=6522fee9&hm=9420db33cbafa8321eb9c5cff9c23bc5f2bb45460cbbe6ede709369659d017bd&'
      ),
    menu = new StringSelectMenuBuilder()
      .setCustomId('help')
      .setPlaceholder(`Selecciona una opcion`),
    row = { type: 1, components: [] } as { type: number; components: any[] };

  if (interaction.options.get('categoria')) {
    embed.setDescription(
      `# 🔎 Comandos en ${
        interaction.options.get('categoria')?.value?.toString() ??
        'Categoria desconocida'
      }\n\n\`\`\`${formatList(
        client.commands
          .filter(
            x =>
              x.data.category ===
              interaction.options.get('categoria')?.value?.toString()
          )
          .map(x => `/${x.data.name}`)
      )}\`\`\``
    );

    embed.setFooter({
      text: `Para ver información de un comando usa /help <comando>`,
    });

    row.components = [
      menu.setOptions(
        client.commands
          .filter(
            x =>
              x.data.category ===
              interaction.options.get('categoria')?.value?.toString()
          )
          .map(command => {
            return {
              label: command.data.name
                .slice(0, 1)
                .toUpperCase()
                .concat(command.data.name.slice(1)),
              value: command.data.name,
            };
          })
      ),
    ];
  } else {
    embed.setDescription(
      `# 🟢 Ayuda\nHola 👋 ***\`${
        interaction.member?.user.username ?? ''
      }\`*** bienvenido a la lista de comandos de PyE Community. Para poder ver información más detallada del comando puedes usar: \n**</help:1160374786199928842> <comando>**\n\n### Categorias del bot:\n\`\`\`${formatList(
        client.commands
          .map(command => command.data.category)
          .filter((x, i, a) => a.indexOf(x) == i)
          .map(category => {
            return category.slice(0, 1).toUpperCase().concat(category.slice(1));
          })
      )}\`\`\``
    );

    embed.setFooter({
      text: 'Para ver información de una categoria usa /help <categoria> ',
    });

    row.components = [
      menu.setOptions(
        client.commands
          .map(x => x.data.category)
          .filter((x, i, a) => a.indexOf(x) == i)
          .map(category => {
            return {
              label: category
                .slice(0, 1)
                .toUpperCase()
                .concat(category.slice(1)),
              value: category,
            };
          })
      ),
    ];
  }

  await interaction
    .reply({ embeds: [embed], components: [row] })
    .catch(console.error);
}

export async function autocomplete(
  interaction: AutocompleteInteraction,
  client: PYECommunityClient
) {
  if (interaction.options.get('categoria'))
    return await interaction.respond(
      client.commands
        .map(command => command.data.category)
        .filter((x, i, a) => a.indexOf(x) == i)
        .map(category => {
          return {
            name: category.slice(0, 1).toUpperCase().concat(category.slice(1)),
            value: category,
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
          name: command.data.name
            .slice(0, 1)
            .toUpperCase()
            .concat(command.data.name.slice(1)),
          value: command.data.name,
        };
      })
  );
}

function formatList(
  array: string[],
  chunk = 3,
  separator = '   ',
  lineBreak = '\n',
  maxColumnWidth = 20
): string {
  let columnWidth = Math.max(...array.map(s => s.length)) + separator.length;
  columnWidth = Math.min(columnWidth, maxColumnWidth);
  let result = '';

  for (let i = 0; i < array.length; i += chunk) {
    const items = array.slice(i, i + chunk);
    const currentSeparator = items.length < chunk ? lineBreak : '';
    result +=
      items.map(item => item.padEnd(columnWidth)).join(currentSeparator) +
      lineBreak;
  }

  return result;
}
