import {
  BaseChannel,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";
import { PyeClient } from "../..";
import config from "../../config";


type Fields = {
  name: string;
  content: string;
};

type ReportError = {
  client: PyeClient;
  error?: Error;
  extraFields?: Fields[];
  typeLabel?: string;
};

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

  const fields: Fields[] = [
    { name: "Server Time", content: new Date().toUTCString() },
    ...extraFields,
    ...errorFields,
  ];

  const content = {
    embeds: [
      new EmbedBuilder()
        .setDescription(
          `# ${typeLabel} Triggered\n
          ${fields
    .map((field) => {
      return `**${field.name}:** ${field.content}`;
    })
    .join("\n")}`
        )
        .setColor(Colors.Red),
    ],
  };

  const reportChannel = await client.discordClient.channels.fetch(
    config.channels.errors_channel
  );
  if (reportChannel?.isTextBased()) {
    await reportChannel.send(content);
  }
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

export async function reportNSFW(
  client: PyeClient,
  message: Message,
  url: string
) {
  const extraFields = [
    { name: "In", content: `<#${message.channel.id}> (${message.channel.id})` },
    { name: "Content", content: `***[Image](${url})***` },

  ];
  await reportError({ client, extraFields, typeLabel: "NSFW Filter" });
}
