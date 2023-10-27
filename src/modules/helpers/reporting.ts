import {
  BaseChannel,
  Colors,
  CommandInteraction,
  EmbedField,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from "discord.js";
import { PyeClient } from "../..";
import config from "../../config";

type ReportError = {
  client: PyeClient;
  error: Error;
  extraFields?: EmbedField[];
  typeLabel?: string;
};

export async function sendToChannel(client: PyeClient, channel: string, content: string | MessagePayload | MessageCreateOptions) {
  const reportChannel = await client.discordClient.channels.fetch(channel);
  if (reportChannel?.isTextBased()) {
    await reportChannel.send(content);
  }
}

/** Base and customizable way to send reports to a channel */
export async function reportError({
  client,
  error,
  extraFields = [],
  typeLabel = '',
}: ReportError) {
  const fields: EmbedField[] = [
    { name: "Error", value: error.message, inline: false },
    { name: "Server Time", value: new Date().toUTCString(), inline: false },
    ...extraFields,
  ];

  const content = {
    embeds: [
      {
        title: `${typeLabel} Triggered`,
        color: Colors.Red,
        fields: fields,
        description: `**Error Stack** :\`\`\`${error.stack ?? ""}\`\`\``,
      },
    ],
  };

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
      value: `<@!${message.member?.user.id ?? ""}> (${
        message.member?.user.id ?? ""
      }`,
      inline: false,
    },
    { name: "At", value: `<#${message.channel?.id ?? ""}>`, inline: false },
    { name: "Command", value: ` ${message.commandName}`, inline: false },
  ];

  await reportError({ client, error, extraFields });
}

export async function reportEventError(
  client: PyeClient,
  channel: BaseChannel,
  error: Error
) {
  const extraFields = [{ name: "At", value: channel.url, inline: false }];
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
      value: `<@!${message.member?.user.id ?? ""}> (${
        message.member?.user.id ?? ""
      }`,
      inline: false
    },
    { name: "Server Time", value: new Date().toUTCString(), inline: false },
    { name: "In", value: `<#${message.channel.id}> (${message.channel.id})`, inline: false },
    { name: "Content", value: `***[Image](${url})***`, inline: false},
  ];

  const content = {
    embeds: [
      {
        title: `NSFW Filter triggered`,
        color: Colors.Red,
        fields: fields,
      },
    ],
  };

  await sendToChannel(client, config.channels.reports_channel, content);
}
