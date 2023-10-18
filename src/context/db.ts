import { PrismaClient } from '@prisma/client'
import { env } from '~/utils/env'

function prismaSingleton() {
  return new PrismaClient()
}

type PrismaSingleton = ReturnType<typeof prismaSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaSingleton()

if (env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
