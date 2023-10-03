import { REST } from '@discordjs/rest';
import { Client, Collection, CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import config from '../../config';

export type SlashCommand = {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction, client?: Client) => void;
};

/** @link https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration */
export const loadSlashCommands = async (): Promise<Collection<string, SlashCommand>> => {
    const commands = new Collection<string, SlashCommand>();

    const slashCommandsPath = path.join(__dirname, '../../commands');
    const slashCommandsFiles = readdirSync(`${slashCommandsPath}`).filter((file) => file.match(/\.(ts|js)$/));

    for (const slashCommandFile of slashCommandsFiles) {
        const slashCommandImported = (await import(`${slashCommandsPath}/${slashCommandFile}`)) as SlashCommand;
        commands.set(slashCommandImported.data?.name, slashCommandImported);
    }

    const rest = new REST({ version: '9' }).setToken(config.bot.DISCORD_TOKEN);
    rest.put(Routes.applicationGuildCommands(config.bot.CLIENT_ID, config.bot.GUILD_ID), {
        body: commands.map((command) => command.data),
    })
        .then(() => {
            console.log('Succesfully registered application commands.');
        })
        .catch(console.error);
    return commands;
};
