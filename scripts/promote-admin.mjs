import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config();

const email=process.argv[2]?.trim().toLowerCase();
if(!email){
  console.error("Usage: npm run admin:promote -- you@example.com");
  process.exit(1);
}
if(!process.env.DATABASE_URL){
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const pool=new pg.Pool({
  connectionString:process.env.DATABASE_URL,
  ssl:process.env.DATABASE_SSL==="false"?false:{rejectUnauthorized:false}
});

try{
  const result=await pool.query(
    `UPDATE gk.users SET role='admin',updated_at=NOW() WHERE email=$1 RETURNING id,email,full_name,role`,
    [email]
  );
  if(!result.rowCount){
    console.error("No GoodKeys user found with that email.");
    process.exitCode=1;
  }else{
    console.log("✓ Admin role granted");
    console.table(result.rows);
    console.log("Log out and log back in so your session receives the new role.");
  }
}finally{
  await pool.end();
}
