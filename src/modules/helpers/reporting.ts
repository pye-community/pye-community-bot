import {
  BaseChannel,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from "discord.js";
import { PyeClient } from "../..";
import config from "../../config";

type Field = {
  name: string;
  content: string;
};

type ReportError = {
  client: PyeClient;
  error?: Error;
  extraFields?: Field[];
  typeLabel?: string;
};

export async function sendToChannel(client: PyeClient, channel: string, content: string | MessagePayload | MessageCreateOptions) {
  const reportChannel = await client.discordClient.channels.fetch(channel);
  if (reportChannel?.isTextBased()) {
    await reportChannel.send(content);
  }
}

/** build a custom embed */
function buildPrettyEmbed(header: string, fields: Field[]): { embeds: EmbedBuilder[] }{
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(
          `# ${header}\n
          ${fields
    .map((field) => {
      return `**${field.name}:** ${field.content}`;
    })
    .join("\n")}`
        )
        .setColor(Colors.Red),
    ],
  };
}

/** Base and customizable way to send reports to a channel */
export async function reportError({
  client,
  error,
  extraFields = [],
  typeLabel = '',
}: ReportError) {
  const errorFields = error ? [
    { name: "Error", content: error.message },
    { name: "Stack", content: `\`\`\`${error.stack ?? ""}\`\`\`` },
  ] : [];

  const fields: Field[] = [
    { name: "Server Time", content: new Date().toUTCString() },
    ...extraFields,
    ...errorFields,
  ];

  const header = `${typeLabel} Triggered`;
  const content = buildPrettyEmbed(header, fields);
  console.log('Report Error', error);
  await sendToChannel(client, config.channels.errors_channel, content);
}

export async function reportMessageError(
  client: PyeClient,
  message: CommandInteraction,
  error: Error
) {
  const extraFields = [
    {
      name: "By",
      content: `<@!${message.member?.user.id ?? ""}> (${
        message.member?.user.id ?? ""
      }`,
    },
    { name: "At", content: `<#${message.channel?.id ?? ""}>` },
    { name: "Command", content: ` ${message.commandName}` },
  ];

  await reportError({ client, error, extraFields });
}

export async function reportEventError(
  client: PyeClient,
  channel: BaseChannel,
  error: Error
) {
  const extraFields = [{ name: "At", content: channel.url }];
  await reportError({ client, error, extraFields, typeLabel: "Event Error" });
}

export async function sendNSFWReport(
  client: PyeClient,
  message: Message,
  url: string
) {
  const fields = [
    {
      name: "By",
      content: `<@!${message.member?.user.id ?? ""}> (${
        message.member?.user.id ?? ""
      }`,
    },
    { name: "Server Time", content: new Date().toUTCString() },
    { name: "In", content: `<#${message.channel.id}> (${message.channel.id})` },
    { name: "Content", content: `***[Image](${url})***` },
  ];
  const header = "NSFW Filter triggered";
  const content = buildPrettyEmbed(header, fields);

  await sendToChannel(client, config.channels.reports_channel, content);
}
