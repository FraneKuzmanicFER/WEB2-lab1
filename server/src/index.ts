import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
import QRCode from 'qrcode';

dotenv.config();

const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({
  origin: process.env.CLIENT_URL,
}));

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256',
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

app.post('/tickets', checkJwt, async (req: Request, res: Response): Promise<void> => {
  const { vatin, firstName, lastName } = req.body;
  if (!vatin || !firstName || !lastName) {
    res.status(400).send('Missing required data fields');
    return;
  }

  try {
    const client = await pool.connect();

    const countResult = await client.query('SELECT COUNT(*) FROM tickets WHERE vatin = $1', [vatin]);
    const ticketCount = parseInt(countResult.rows[0].count, 10);

    if (ticketCount >= 3) {
      client.release();
      res.status(400).send('This VATIN has already generated 3 or more tickets');
      return;
    }

    const result = await client.query(
      'INSERT INTO tickets (id, vatin, firstName, lastName, timeOfPurchase) VALUES (gen_random_uuid(), $1, $2, $3, NOW()) RETURNING *',
      [vatin, firstName, lastName]
    );
    const ticketId = result.rows[0].id;
    client.release();

    const ticketUrl = `http://localhost:${process.env.CLIENT_URL}/ticket/${ticketId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(ticketUrl);


    res.status(201).json({ qrCode: qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating ticket');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});