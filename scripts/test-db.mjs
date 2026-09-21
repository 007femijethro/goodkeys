import dotenv from "dotenv";
import pg from "pg";

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
  const connection = await pool.query(
    "SELECT current_database() AS database, current_user AS user, NOW() AS connected_at"
  );

  const tables = await pool.query(
    `SELECT table_name
       FROM information_schema.tables
      WHERE table_schema = 'gk'
      ORDER BY table_name`
  );

  console.log("✓ Connected to PostgreSQL");
  console.table(connection.rows);
  console.log("GoodKeys tables:");
  console.table(tables.rows);
} catch (error) {
  console.error("Database connection test failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
