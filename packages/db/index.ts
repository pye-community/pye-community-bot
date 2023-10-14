import { PrismaClient } from '@prisma/client'
import { env } from '@pye-community-bot/env'

export * from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['query', 'error', 'warn'] })

if (env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
