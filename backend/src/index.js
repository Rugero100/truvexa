import 'dotenv/config';
import { createApp } from './app.js';
import { pool } from './db.js';
const port = Number(process.env.PORT || 4000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Set a unique JWT_SECRET of at least 32 characters in backend/.env.');
  process.exit(1);
}
try {
  await pool.query('SELECT 1');
  createApp().listen(port, () => console.log(`TRUVEXA API ready at http://localhost:${port}/api`));
} catch (error) {
  console.error('Could not connect to MySQL. Check backend/.env and database setup:', error.message);
  process.exit(1);
}
