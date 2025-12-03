import React from 'react';

function StatsPanel({ stats }) {
  const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="stats-panel">
      <div className="level-display">
        <div className="level-badge">
          <span className="level-number">{stats.level}</span>
          <span className="level-label">LEVEL</span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ width: `${xpPercentage}%` }}
            >
              <div className="xp-glow"></div>
            </div>
          </div>
          <div className="xp-text">
            <span className="xp-current">{stats.xp}</span>
            <span className="xp-separator">/</span>
            <span className="xp-max">{stats.xpToNextLevel} XP</span>
          </div>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">₿</span>
          <span className="stat-value">{stats.totalSats.toLocaleString()}</span>
          <span className="stat-label">Total Sats</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <span className="stat-value">{stats.questsCompleted}</span>
          <span className="stat-label">Quests Done</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <span className="stat-value">#{stats.rank}</span>
          <span className="stat-label">Global Rank</span>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
