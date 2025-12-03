const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Determine if we should use the database
// Use DB only in production when NEON_DB_URL is set and SKIP_DB is not true
const isProduction = process.env.NODE_ENV === 'production';
const skipDbExplicitly = process.env.SKIP_DB === 'true';
const USE_DB = isProduction && !skipDbExplicitly && !!process.env.NEON_DB_URL;

let pool = null;

// Connect to DB only when USE_DB is true
if (USE_DB) {
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });
}

// Simple in-memory rate limiting
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }
  
  const record = rateLimitStore.get(ip);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    return next();
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }
  
  record.count++;
  next();
}

// Apply rate limiting to all API routes
app.use('/api', rateLimit);

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
    // Note: Table schema should include: address (PRIMARY KEY), provider, created_at, updated_at
    await pool.query(
      'INSERT INTO wallets (address, provider, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) ON CONFLICT (address) DO UPDATE SET provider = $2, updated_at = NOW()',
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
