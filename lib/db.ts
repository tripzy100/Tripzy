import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === "production";

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: isProduction ? ["error"] : ["query", "error", "warn"],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (!isProduction) {
  globalThis.prisma = db;
}
