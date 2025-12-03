import React from 'react';

function TaskCard({ task, onComplete }) {
  const { id, title, description, category, icon, reward, completed, difficulty } = task;

  const handleComplete = () => {
    if (!completed && onComplete) {
      onComplete(id);
    }
  };

  return (
    <div className={`task-card ${completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div className="task-icon">{icon}</div>
        <div className="task-info">
          <h3 className="task-title">{title}</h3>
          <span className="task-category">{category}</span>
        </div>
      </div>
      <p className="task-description">{description}</p>
      <div className="task-footer">
        <div className="task-reward">
          <span className="reward-icon">🪙</span>
          <span className="reward-amount">+{reward} points</span>
        </div>
        <button
          className={`task-button ${completed ? 'completed' : ''}`}
          onClick={handleComplete}
          disabled={completed}
        >
          {completed ? 'Completed' : 'Complete Task'}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
