import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
});

const run = async () => {
  // works for both tsx (src/) and compiled JS (dist/)
  const migrationDir = path.join(process.cwd(), 'src', 'db', 'migrations');

  const files = fs.readdirSync(migrationDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf-8');
    await pool.query(sql);
    console.log(`✅ Done: ${file}`);
  }

  await pool.end();
  console.log('All migrations complete.');
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});