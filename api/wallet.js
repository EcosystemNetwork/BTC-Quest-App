const express = require('express');
const app = express();

app.use(express.json());

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

  // In development mode, skip DB operations
  if (process.env.NODE_ENV === 'development' || process.env.SKIP_DB === 'true') {
    return res.json({ 
      success: true, 
      message: 'Wallet registered (dev mode - no DB)',
      address 
    });
  }

  // Production mode with Neon DB
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false }
    });

    await pool.query(
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
