const express = require('express');

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wallet endpoint
app.post('/api/wallet', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  // In development mode, skip DB connection
  if (process.env.NODE_ENV === 'development' || process.env.SKIP_DB === 'true') {
    return res.json({ success: true, message: 'Wallet connected (dev mode)', address });
  }

  // Production mode: connect to Neon DB
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pool.query(
      'INSERT INTO wallets (address) VALUES ($1) ON CONFLICT (address) DO NOTHING',
      [address]
    );

    res.json({ success: true, message: 'Wallet saved', address });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

module.exports = app;
