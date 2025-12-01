import React from 'react';
import { calculateLevel } from '../data/tasks';

function ProgressCard({ points, tasksCompleted, totalTasks }) {
  const { level, currentPoints, nextLevelPoints, progress } = calculateLevel(points);

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div>
          <h3>Your Progress</h3>
          <p className="progress-text">
            {tasksCompleted} of {totalTasks} tasks completed
          </p>
        </div>
        <div className="level-badge">Level {level}</div>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="progress-text">
        {currentPoints} / {nextLevelPoints} points to next level
      </p>
    </div>
  );
}

export default ProgressCard;
