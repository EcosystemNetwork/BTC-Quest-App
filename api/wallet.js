import express from 'express';
import pg from 'pg';
import rateLimit from 'express-rate-limit';

const { Pool } = pg;

// Determine environment and database configuration
const isDev = process.env.NODE_ENV === 'development';
const skipDb = process.env.SKIP_DB === 'true' || isDev;

// Only initialize pool if we're in production and have DB credentials
// Note: Neon DB requires SSL but handles certificate verification on their end
const pool = skipDb ? null : new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: true,
});

const app = express();
app.use(express.json());

// Rate limiting middleware to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: skipDb ? 'development' : 'production' });
});

// Wallet connection endpoint
app.post('/api/wallet/connect', async (req, res) => {
  const { address, provider } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  // In development mode, just acknowledge the connection
  if (skipDb) {
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
    console.error('Database error during wallet connection');
    res.status(500).json({ error: 'Failed to store wallet connection' });
  }
});

// Get wallet info endpoint
app.get('/api/wallet/:address', async (req, res) => {
  const { address } = req.params;

  if (skipDb) {
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
    console.error('Database error fetching wallet info');
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
