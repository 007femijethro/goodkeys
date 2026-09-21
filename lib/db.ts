import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const globalForDb = globalThis as unknown as {
  goodKeysPool?: Pool;
};

export const db =
  globalForDb.goodKeysPool ??
  new Pool({
    connectionString,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? false
        : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.goodKeysPool = db;
}
