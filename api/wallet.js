// Wallet API endpoint for Vercel serverless functions
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
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
