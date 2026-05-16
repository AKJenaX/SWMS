import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, executeQuery } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  await connectDB();

  const migrationsDir = path.resolve(__dirname, '../migrations');
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = await fs.readFile(fullPath, 'utf8');
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await executeQuery(statement);
    }
    console.log(`Applied migration: ${file}`);
  }
}

runMigrations()
  .then(() => {
    console.log('Migrations completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });
