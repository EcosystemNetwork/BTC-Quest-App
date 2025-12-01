const express = require('express');

const app = express();
app.use(express.json());

// Skip DB in development mode
const skipDB = process.env.SKIP_DB === 'true' || process.env.NODE_ENV === 'development';

// Simulated user data for development
const mockUserData = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  totalSats: 0,
  questsCompleted: 0,
  streak: 0,
  rank: 42,
  achievements: [],
  completedQuests: [1]
};

// GET /api/wallet - Get user stats by wallet address
app.get('/api/wallet', async (req, res) => {
  const { address } = req.query;
  
  if (!address) {
    return res.status(400).json({ error: 'Wallet address required' });
  }
  
  if (skipDB) {
    // Return mock data in development
    return res.json({
      success: true,
      address,
      data: mockUserData
    });
  }
  
  // Production: connect to Neon DB
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const result = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [address]
    );
    
    if (result.rows.length === 0) {
      // Create new user
      await pool.query(
        'INSERT INTO users (wallet_address, level, xp, streak) VALUES ($1, 1, 0, 0)',
        [address]
      );
      return res.json({
        success: true,
        address,
        data: mockUserData,
        isNewUser: true
      });
    }
    
    return res.json({
      success: true,
      address,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', message: error.message });
  }
});

// POST /api/wallet/xp - Add XP to user
app.post('/api/wallet/xp', async (req, res) => {
  const { address, xp, questId } = req.body;
  
  if (!address || xp === undefined) {
    return res.status(400).json({ error: 'Wallet address and XP amount required' });
  }
  
  if (skipDB) {
    // Mock XP gain in development
    mockUserData.xp += xp;
    if (mockUserData.xp >= mockUserData.xpToNextLevel) {
      mockUserData.level += 1;
      mockUserData.xp -= mockUserData.xpToNextLevel;
      mockUserData.xpToNextLevel = Math.floor(mockUserData.xpToNextLevel * 1.5);
    }
    if (questId) {
      mockUserData.questsCompleted += 1;
      mockUserData.completedQuests.push(questId);
    }
    return res.json({
      success: true,
      data: mockUserData
    });
  }
  
  // Production: update database
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const result = await pool.query(
      'UPDATE users SET xp = xp + $1, quests_completed = quests_completed + 1 WHERE wallet_address = $2 RETURNING *',
      [xp, address]
    );
    
    return res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', message: error.message });
  }
});

// GET /api/wallet/leaderboard - Get top players
app.get('/api/wallet/leaderboard', async (req, res) => {
  if (skipDB) {
    return res.json({
      success: true,
      data: [
        { rank: 1, name: 'SatoshiMaxi', level: 99, xp: 125000, avatar: '🐋' },
        { rank: 2, name: 'DiamondHands', level: 87, xp: 98500, avatar: '💎' },
        { rank: 3, name: 'BitcoinBeliever', level: 76, xp: 82000, avatar: '🦁' },
        { rank: 4, name: 'StackerKing', level: 65, xp: 71200, avatar: '👑' },
        { rank: 5, name: 'HODLer4Life', level: 58, xp: 64800, avatar: '🚀' },
      ]
    });
  }
  
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.NEON_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const result = await pool.query(
      'SELECT wallet_address, level, xp FROM users ORDER BY level DESC, xp DESC LIMIT 10'
    );
    
    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', message: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
    console.log(`Database: ${skipDB ? 'SKIPPED (dev mode)' : 'Connected'}`);
  });
}

module.exports = app;
