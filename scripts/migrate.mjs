import dotenv from "dotenv";
import pg from "pg";
import { readFile } from "node:fs/promises";
import path from "node:path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Create .env.local first.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

try {
  const sql = await readFile(
    path.join(process.cwd(), "db/migrations/001_init_goodkeys.sql"),
    "utf8"
  );

  console.log("Running GoodKeys database migration...");
  await pool.query(sql);

  await pool.query(
    `INSERT INTO gk.schema_migrations(version)
     VALUES ($1)
     ON CONFLICT (version) DO NOTHING`,
    ["001_init_goodkeys"]
  );

  console.log("✓ Migration complete.");
  console.log("✓ Schema: gk");
} catch (error) {
  console.error("Migration failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
