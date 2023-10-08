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
        'https://cdn.discordapp.com/attachments/768329192131526686/1160379631350857728/3513b19499eea111db54cef4336f7b77.png?ex=653472be&is=6521fdbe&hm=6242f482f93d9e7b63caa43485228af1174870bfdfe0676d7bf9000607aa53f4&'
      ),
    menu = new StringSelectMenuBuilder()
      .setCustomId('help')
      .setPlaceholder(`Selecciona una opcion`),
    row = { type: 1, components: [] } as { type: number; components: any[] };

  if (interaction.options.get('categoria')) {
    embed.setDescription(
      `# Ayuda ${client.commands
        .filter(
          x =>
            x.data.category ===
            interaction.options.get('categoria')?.value?.toString()
        )
        .map(x => `\`${x.data.name}\``)
        .join(', ')}`
    );
  } else {
    embed.setDescription(
      `# 🟢 Ayuda\nHola 👋 ***\`${
        interaction.member?.user.username ?? ''
      }\`*** bienvenido a la lista de comandos de PyE Community. Para poder ver información más detallada del comando puedes usar: \n**</help:1160374786199928842> <comando>**\n\n\`\`\`${formatList(
        client.commands
          .map(command => command.data.category)
          .filter((x, i, a) => a.indexOf(x) == i)
          .map(category => {
            return category.slice(0, 1).toUpperCase().concat(category.slice(1));
          })
      )}\`\`\``
    );

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

  await interaction.reply({ embeds: [embed], components: [row] });
}

export async function autocomplete(
  interaction: AutocompleteInteraction,
  client: PYECommunityClient
) {
  if (interaction.options.get('categoria'))
    await interaction.respond(
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
  array: Array<string>,
  separator: string = '',
  chunk = 3,
  prefix = '  '
) {
  const columnWidth = Math.max(...array.map(s => s.length)) + prefix.length;
  let result = '';
  for (let i = 0; i < array.length; i += chunk) {
    const items = array.slice(i, i + chunk);
    result +=
      items
        .map(item => item + Array(columnWidth - item.length).join(' '))
        .join(separator) + '\n';
  }
  return result;
}
