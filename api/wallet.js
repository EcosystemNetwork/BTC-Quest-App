// Wallet API endpoint for Vercel serverless functions
import express from 'express';
import rateLimit from 'express-rate-limit';

// Check if we should skip DB (development mode)
const skipDB = process.env.SKIP_DB === 'true' || process.env.NODE_ENV === 'development';

// Initialize database connection only in production with Neon DB
let pool = null;
if (!skipDB && process.env.NEON_DB_URL) {
  try {
    const pg = await import('pg');
    const { Pool } = pg.default;
    pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false },
    });
  } catch (error) {
    console.error('Failed to initialize database pool:', error);
  }
}

// Create express app
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

// Validate Bitcoin address format (supports legacy, SegWit, and Taproot)
function isValidBitcoinAddress(address) {
  if (!address || typeof address !== 'string') return false;
  
  // Legacy addresses (P2PKH) start with 1
  const legacyRegex = /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  // Legacy addresses (P2SH) start with 3
  const p2shRegex = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  // Native SegWit (Bech32) addresses start with bc1q
  const segwitRegex = /^bc1q[a-z0-9]{38,59}$/;
  // Taproot (Bech32m) addresses start with bc1p
  const taprootRegex = /^bc1p[a-z0-9]{58}$/;
  
  return legacyRegex.test(address) || 
         p2shRegex.test(address) || 
         segwitRegex.test(address) || 
         taprootRegex.test(address);
}

// Set CORS headers
function setCorsHeaders(res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || (
    process.env.NODE_ENV === 'production' 
      ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
      : '*'
  );
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Health check endpoint
app.get('/api/wallet', (req, res) => {
  setCorsHeaders(res);
  res.json({
    status: 'ok',
    mode: skipDB ? 'development' : 'production',
    database: pool ? 'connected' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// Handle OPTIONS for CORS preflight
app.options('/api/wallet', (req, res) => {
  setCorsHeaders(res);
  res.status(200).end();
});

// Store wallet connection
app.post('/api/wallet/connect', apiLimiter, async (req, res) => {
  setCorsHeaders(res);
  
  const { address, publicKey, provider, network } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  if (!isValidBitcoinAddress(address)) {
    return res.status(400).json({ error: 'Invalid Bitcoin address format' });
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
  setCorsHeaders(res);
  
  const { address } = req.params;

  if (!isValidBitcoinAddress(address)) {
    return res.status(400).json({ error: 'Invalid Bitcoin address format' });
  }

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
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Wallet API server running on port ${PORT}`);
    console.log(`Mode: ${skipDB ? 'development' : 'production'}`);
    console.log(`Database: ${pool ? 'configured' : 'not configured'}`);
  });
}
