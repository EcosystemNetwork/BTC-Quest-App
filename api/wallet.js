import express from 'express';
import pg from 'pg';

const { Pool } = pg;

// Only initialize pool if we're in production and have DB credentials
const isDev = process.env.NODE_ENV === 'development' || process.env.SKIP_DB === 'true';
const pool = isDev ? null : new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: isDev ? 'development' : 'production' });
});

// Wallet connection endpoint
app.post('/api/wallet/connect', async (req, res) => {
  const { address, provider } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  // In development mode, just acknowledge the connection
  if (isDev) {
    return res.json({
      success: true,
      message: 'Wallet connected (dev mode - no DB)',
      address,
      provider,
    });
  }

  // In production, store the connection in the database
  try {
    const result = await pool.query(
      `INSERT INTO wallet_connections (address, provider, connected_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (address) DO UPDATE SET provider = $2, connected_at = NOW()
       RETURNING *`,
      [address, provider || 'unknown']
    );

    res.json({
      success: true,
      message: 'Wallet connected',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to store wallet connection' });
  }
});

// Get wallet info endpoint
app.get('/api/wallet/:address', async (req, res) => {
  const { address } = req.params;

  if (isDev) {
    return res.json({
      address,
      message: 'Wallet info (dev mode - no DB)',
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM wallet_connections WHERE address = $1',
      [address]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

// For local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
export default app;
