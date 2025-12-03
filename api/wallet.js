const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Skip DB connection in development mode
const SKIP_DB = process.env.SKIP_DB === 'true' || process.env.NODE_ENV !== 'production';

let pool = null;

// Only connect to DB in production
if (!SKIP_DB && process.env.NEON_DB_URL) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    dbConnected: !!pool,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Wallet registration endpoint
app.post('/api/wallet', async (req, res) => {
  const { address, provider } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  // In dev mode or without DB, just acknowledge the wallet
  if (!pool) {
    return res.json({ 
      success: true, 
      message: 'Wallet registered (dev mode - no DB)',
      address,
      provider
    });
  }

  try {
    // In production, store wallet info in database
    await pool.query(
      'INSERT INTO wallets (address, provider, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (address) DO UPDATE SET provider = $2, updated_at = NOW()',
      [address, provider]
    );

    res.json({ 
      success: true, 
      message: 'Wallet registered successfully',
      address,
      provider
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to register wallet' });
  }
});

// Get wallet info endpoint
app.get('/api/wallet/:address', async (req, res) => {
  const { address } = req.params;

  if (!pool) {
    return res.json({ 
      success: true,
      message: 'Dev mode - wallet lookup not available',
      address
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM wallets WHERE address = $1',
      [address]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({ 
      success: true, 
      wallet: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to get wallet info' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: ${pool ? 'connected' : 'not connected (dev mode)'}`);
});

module.exports = app;
