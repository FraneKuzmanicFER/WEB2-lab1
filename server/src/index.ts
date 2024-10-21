import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
}));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

app.get('/tickets', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) FROM tickets');
    client.release();
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching ticket count');
  }
});

// Define a route
app.get('/', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.send(`Hello, TypeScript with Express! Current time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.send('Error ' + err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});