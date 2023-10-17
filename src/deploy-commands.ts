import { REST, Routes } from 'discord.js'
import { schema } from '~/commands'
import { env } from '~/utils/env'

async function start() {
  const rest = new REST({ version: '10' }).setToken(env.DISCORD_SECRET)

  /**
   * This is a development only command.
   */

  if (env.NODE_ENV === 'development') {
    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), {
      body: [],
    })

    await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), {
      body: schema,
    })
  }

  /**
   * This is a production only command.
   */

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
