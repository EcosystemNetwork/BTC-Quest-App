import React from 'react';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'SatoshiMaxi', level: 99, xp: 125000, avatar: '🐋' },
  { rank: 2, name: 'DiamondHands', level: 87, xp: 98500, avatar: '💎' },
  { rank: 3, name: 'BitcoinBeliever', level: 76, xp: 82000, avatar: '🦁' },
  { rank: 4, name: 'StackerKing', level: 65, xp: 71200, avatar: '👑' },
  { rank: 5, name: 'HODLer4Life', level: 58, xp: 64800, avatar: '🚀' },
];

function Leaderboard({ rank }) {
  return (
    <div className="leaderboard-panel">
      <h3 className="panel-title">
        <span className="title-icon">📊</span>
        Leaderboard
      </h3>
      
      <div className="leaderboard-list">
        {LEADERBOARD_DATA.map((player, index) => (
          <div 
            key={player.rank}
            className={`leaderboard-entry ${index < 3 ? 'top-three' : ''}`}
          >
            <div className="rank-badge">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${player.rank}`}
            </div>
            <span className="player-avatar">{player.avatar}</span>
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="player-level">Lv.{player.level}</span>
            </div>
            <span className="player-xp">{(player.xp / 1000).toFixed(1)}K XP</span>
          </div>
        ))}
      </div>
      
      <div className="your-rank">
        <span className="your-rank-label">Your Rank</span>
        <span className="your-rank-value">#{rank}</span>
        <span className="rank-hint">Keep questing to climb! 📈</span>
      </div>
    </div>
  );
}

export default Leaderboard;
