import React from 'react';

function Achievements({ achievements, tasksCompleted, points, socialTasksCompleted }) {
  const isUnlocked = (achievement) => {
    switch (achievement.type) {
      case 'tasks':
        return tasksCompleted >= achievement.requirement;
      case 'points':
        return points >= achievement.requirement;
      case 'social':
        return socialTasksCompleted >= achievement.requirement;
      default:
        return false;
    }
  };

  return (
    <div className="achievements-section">
      <h2 className="section-title">🏅 Achievements</h2>
      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`achievement-badge ${isUnlocked(achievement) ? 'unlocked' : 'locked'}`}
            title={`${achievement.name}: ${achievement.description}`}
          >
            {achievement.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
