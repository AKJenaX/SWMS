import mysql from 'mysql2/promise';

let db;

export async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',      // MySQL host
      user: 'root',           // MySQL username
      password: 'anup',           // MySQL password
      database: 'pro',        // Your database name
      port: 3306              // Default MySQL port
    });
    console.log('✅ Connected to MySQL database');
  } catch (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
    process.exit(1); // Stop server if DB fails
  }
}

export { db };
