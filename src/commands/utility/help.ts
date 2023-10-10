import {
  AutocompleteInteraction,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
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
      .setThumbnail(client.user?.displayAvatarURL() ?? ''),
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
  } else if (interaction.options.get('comando')) {
    const command = client.commands.find(
      x =>
        x.data.name ===
        interaction.options.get('comando')?.value?.toString().toLowerCase()
    );

    if (!command) {
      embed.setDescription(
        `# ❌ Comando desconocido\nEl comando \`${
          interaction.options.get('comando')?.value?.toString() ?? ''
        }\` no existe.`
      );
    } else {
      embed.setDescription(
        `# 📖 Información de ${command.data.name
          .slice(0, 1)
          .toUpperCase()
          .concat(command.data.name.slice(1))}\n\n**Descripción:** ${
          command.data.description
        }\n**Categoria:** ${command.data.category
          .slice(0, 1)
          .toUpperCase()
          .concat(command.data.category.slice(1))}\n**Cooldown:** ${
          command.data?.cooldown ?? '5'
        } segundos`
      );

      embed.setFooter({
        text: `Para ver información de una categoria usa /help <categoria>`,
      });
    }

    row.components = [
      menu.setOptions(
        client.commands
          .filter(x => x.data.category === command?.data.category)
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

export async function interactions(
  interaction: StringSelectMenuInteraction,
  client: PYECommunityClient
) {
  const commandOrCategory =
    client.commands.get(interaction?.values?.[0]) ??
    client.commands
      .filter(x => x.data.category === interaction?.values?.[0])
      .map(x => x.data.name);
  if (!commandOrCategory) return;

  const message = await interaction
    .deferReply({ ephemeral: true })
    .catch(console.error);

  if (!(commandOrCategory instanceof Array)) {
    message
      ?.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
              `# 📖 Información de ${commandOrCategory.data.name
                .slice(0, 1)
                .toUpperCase()
                .concat(
                  commandOrCategory.data.name.slice(1)
                )}\n\n**Descripción:** ${
                commandOrCategory.data.description
              }\n**Categoria:** ${commandOrCategory.data.category
                .slice(0, 1)
                .toUpperCase()
                .concat(
                  commandOrCategory.data.category.slice(1)
                )}\n**Cooldown:** ${
                commandOrCategory.data?.cooldown ?? '5'
              } segundos`
            ),
        ],
      })
      .catch(console.error);
  } else {
    message
      ?.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Green)
            .setDescription(
              `# 🔎 Comandos en ${
                interaction.values?.[0] ?? 'Categoria desconocida'
              }\n\n\`\`\`${formatList(
                client.commands
                  .filter(
                    x => x.data.category === interaction.values?.[0].toString()
                  )
                  .map(x => `/${x.data.name}`)
              )}\`\`\``
            ),
        ],
      })
      .catch(console.error);
  }
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
