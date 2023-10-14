import { REST, Routes } from 'discord.js'

import { schema } from '@pye-community-bot/commands'
import { env } from '@pye-community-bot/env'

async function start() {
  const rest = new REST({ version: '10' }).setToken(env.DISCORD_SECRET)

  if (env.NODE_ENV === 'development') {
    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), {
      body: [],
    })

    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), {
      body: schema,
    })
  }

  if (env.NODE_ENV === 'production') {
    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
      body: [],
    })

    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
      body: schema,
    })
  }
}

start()
