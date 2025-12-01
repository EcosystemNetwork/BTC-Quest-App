import React from 'react';

const ACHIEVEMENTS = [
  { id: 1, name: 'First Steps', icon: '👶', description: 'Connect your wallet', unlockLevel: 1 },
  { id: 2, name: 'Rising Star', icon: '⭐', description: 'Reach Level 5', unlockLevel: 5 },
  { id: 3, name: 'Stack Master', icon: '💰', description: 'Reach Level 10', unlockLevel: 10 },
  { id: 4, name: 'Diamond Hands', icon: '💎', description: 'Reach Level 25', unlockLevel: 25 },
  { id: 5, name: 'Whale Status', icon: '🐋', description: 'Reach Level 50', unlockLevel: 50 },
  { id: 6, name: 'Legend', icon: '👑', description: 'Reach Level 100', unlockLevel: 100 },
];

function AchievementBadges({ level }) {
  return (
    <div className="achievements-panel">
      <h3 className="panel-title">
        <span className="title-icon">🏅</span>
        Achievements
      </h3>
      <div className="badges-grid">
        {ACHIEVEMENTS.map(achievement => {
          const unlocked = level >= achievement.unlockLevel;
          return (
            <div
              key={achievement.id}
              className={`badge ${unlocked ? 'unlocked' : 'locked'}`}
              title={`${achievement.name}: ${achievement.description}`}
            >
              <span className="badge-icon">{unlocked ? achievement.icon : '🔒'}</span>
              <span className="badge-name">{achievement.name}</span>
              {!unlocked && (
                <span className="unlock-hint">Lv.{achievement.unlockLevel}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementBadges;
