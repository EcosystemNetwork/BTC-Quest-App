const express = require('express');
const app = express();

app.use(express.json());

// Create database pool once at module level (lazy initialization for serverless)
let pool = null;
function getPool() {
  if (!pool && process.env.NEON_DB_URL) {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

// Basic Bitcoin address validation (supports legacy, segwit, and taproot)
function isValidBitcoinAddress(address) {
  if (!address || typeof address !== 'string') return false;
  // Legacy addresses start with 1 or 3, SegWit with bc1, Taproot with bc1p
  const bitcoinAddressRegex = /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/i;
  return bitcoinAddressRegex.test(address);
}

// Health check endpoint
app.get('/api/wallet', (req, res) => {
  res.json({ status: 'ok', message: 'Wallet API is running' });
});

// Wallet registration endpoint (for production use with DB)
app.post('/api/wallet', async (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  if (!isValidBitcoinAddress(address)) {
    return res.status(400).json({ error: 'Invalid Bitcoin address format' });
  }

  // In development mode, skip DB operations
  if (process.env.NODE_ENV === 'development' || process.env.SKIP_DB === 'true') {
    return res.json({ 
      success: true, 
      message: 'Wallet registered (dev mode - no DB)',
      address 
    });
  }

  // Production mode with Neon DB
  const dbPool = getPool();
  if (!dbPool) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    await dbPool.query(
      'INSERT INTO wallets (address) VALUES ($1) ON CONFLICT (address) DO NOTHING',
      [address]
    );

    res.json({ success: true, message: 'Wallet registered', address });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to register wallet' });
  }
});

// For Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Wallet API running on port ${PORT}`);
  });
}
