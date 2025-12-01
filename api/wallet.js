// API endpoint for wallet operations
// This handles backend wallet-related operations

import express from 'express';
import pg from 'pg';
import rateLimit from 'express-rate-limit';

// Check if we should skip DB (development mode)
const skipDB = process.env.SKIP_DB === 'true' || process.env.NODE_ENV === 'development';

let pool = null;

// Initialize database connection only in production
if (!skipDB && process.env.NEON_DB_URL) {
  const { Pool } = pg;
  pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

// Create express app for local development
const app = express();
app.use(express.json());

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mode: skipDB ? 'development' : 'production',
    database: pool ? 'connected' : 'not configured'
  });
});

// Store wallet connection (for tracking purposes)
app.post('/api/wallet/connect', apiLimiter, async (req, res) => {
  const { address, publicKey, provider, network } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  // In development mode, just return success
  if (skipDB || !pool) {
    return res.json({
      success: true,
      message: 'Wallet connected (dev mode - no DB)',
      data: { address, provider, network }
    });
  }

  // In production, store the connection
  try {
    const result = await pool.query(
      `INSERT INTO wallet_connections (address, public_key, provider, network, connected_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (address) DO UPDATE SET
         public_key = EXCLUDED.public_key,
         provider = EXCLUDED.provider,
         network = EXCLUDED.network,
         connected_at = NOW()
       RETURNING *`,
      [address, publicKey, provider, network]
    );

    res.json({
      success: true,
      message: 'Wallet connection recorded',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to record wallet connection',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get wallet status
app.get('/api/wallet/status/:address', apiLimiter, async (req, res) => {
  const { address } = req.params;

  if (skipDB || !pool) {
    return res.json({
      success: true,
      data: null,
      message: 'No data available (dev mode)'
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM wallet_connections WHERE address = $1',
      [address]
    );

    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to get wallet status' });
  }
});

// Vercel serverless function handler
export default app;

// Start server for local development
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isMainModule) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Wallet API server running on port ${PORT}`);
    console.log(`Mode: ${skipDB ? 'development' : 'production'}`);
    console.log(`Database: ${pool ? 'configured' : 'not configured'}`);
  });
}
