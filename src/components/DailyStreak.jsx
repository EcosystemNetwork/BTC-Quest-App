import React from 'react';

function DailyStreak({ streak }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="streak-panel">
      <h3 className="panel-title">
        <span className="title-icon">🔥</span>
        Daily Streak
      </h3>
      <div className="streak-display">
        <div className="streak-number">{streak}</div>
        <div className="streak-label">Day{streak !== 1 ? 's' : ''}</div>
      </div>
      <div className="streak-week">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day-marker ${index < streak % 7 ? 'active' : ''}`}
          >
            <span className="day-letter">{day}</span>
            <span className="day-flame">{index < streak % 7 ? '🔥' : '○'}</span>
          </div>
        ))}
      </div>
      <p className="streak-bonus">
        {streak > 0 
          ? `+${Math.min(streak * 5, 50)}% XP Bonus Active!` 
          : 'Complete a quest to start your streak!'}
      </p>
    </div>
  );
}

export default DailyStreak;
