import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  // Reduce simultaneous connections to avoid hitting Neon limits and increase
  // connection timeout so slow networks don't fail immediately.
  max: 6,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 10000,
  // Allow Node to exit cleanly if the pool is idle (useful for local dev/tests)
  allowExitOnIdle: true,
});

// Helpful debug logging for pool errors (will not crash the process)
pool.on("error", (err) => {
  console.error("Postgres pool error:", err);
});


const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" 
      ? ["error", "warn"] 
      : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
