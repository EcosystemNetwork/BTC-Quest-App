const express = require('express');

const app = express();

app.use(express.json());

// Database pool - created once and reused across requests
let pool = null;

function getPool() {
  if (!pool) {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: true,
    });
  }
  return pool;
}

// Simple in-memory rate limiter
const rateLimit = {
  requests: new Map(),
  windowMs: 60000, // 1 minute
  maxRequests: 10, // max 10 requests per minute per IP
};

function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;

  // Clean old entries
  const userRequests = rateLimit.requests.get(ip) || [];
  const recentRequests = userRequests.filter(time => time > windowStart);

  if (recentRequests.length >= rateLimit.maxRequests) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }

  recentRequests.push(now);
  rateLimit.requests.set(ip, recentRequests);
  next();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Wallet endpoint with rate limiting
app.post('/api/wallet', rateLimiter, async (req, res) => {
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
    const dbPool = getPool();

    await dbPool.query(
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
