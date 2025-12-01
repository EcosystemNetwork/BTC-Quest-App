const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SKIP_DB = process.env.SKIP_DB === 'true' || process.env.NODE_ENV === 'development';

let db = null;

async function initDB() {
  if (SKIP_DB) {
    console.log('Skipping database connection (development mode)');
    return;
  }

  if (!process.env.NEON_DB_URL) {
    console.warn('NEON_DB_URL not set, database features will be disabled');
    return;
  }

  try {
    const { Pool } = require('pg');
    db = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false },
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

app.get('/api/wallet', async (req, res) => {
  res.json({ status: 'ok', message: 'Wallet API is running' });
});

app.post('/api/wallet/connect', async (req, res) => {
  const { address, provider } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  let dbSaved = false;
  if (db && !SKIP_DB) {
    try {
      await db.query(
        'INSERT INTO wallets (address, provider, connected_at) VALUES ($1, $2, NOW()) ON CONFLICT (address) DO UPDATE SET provider = $2, connected_at = NOW()',
        [address, provider || 'unknown']
      );
      dbSaved = true;
    } catch (error) {
      console.error('Database error:', error);
    }
  }

  res.json({ 
    status: 'connected', 
    address,
    provider: provider || 'unknown',
    dbSaved,
    message: SKIP_DB ? 'Connected (dev mode - no DB)' : (dbSaved ? 'Connected and saved to database' : 'Connected but database save failed')
  });
});

app.post('/api/wallet/disconnect', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  res.json({ status: 'disconnected', address });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Wallet API running on port ${PORT}`);
  });
});

module.exports = app;
