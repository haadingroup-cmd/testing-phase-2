import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/** True when a database connection string is configured. */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/**
 * Lazily-created Prisma client. Re-used across hot reloads in development
 * and across invocations of a warm serverless function in production.
 */
export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}
