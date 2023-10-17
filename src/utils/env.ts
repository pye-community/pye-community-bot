import 'dotenv/config'
import process from 'node:process'

import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Discord
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_GUILD_ID: z.string(),
    DISCORD_SECRET: z.string(),

    // Prisma
    DATABASE_URL: z.string(),

    // Environment
    NODE_ENV: z.string().default('development'),
  },
  runtimeEnv: process.env,
})
