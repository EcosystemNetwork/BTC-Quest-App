// Wallet API endpoint for Vercel serverless functions

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

export default function handler(req, res) {
  // Set CORS headers - use environment variable or default to same-origin in production
  const allowedOrigin = process.env.ALLOWED_ORIGIN || (
    process.env.NODE_ENV === 'production' 
      ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
      : '*'
  );
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Wallet API is running',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    const { address } = req.body || {};
    
    if (!address) {
      return res.status(400).json({
        error: 'Wallet address is required'
      });
    }

    if (!isValidBitcoinAddress(address)) {
      return res.status(400).json({
        error: 'Invalid Bitcoin address format'
      });
    }

    // In production, you would save this to Neon DB
    // For now, just acknowledge the connection
    return res.status(200).json({
      status: 'connected',
      address: address,
      message: 'Wallet connection recorded'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
