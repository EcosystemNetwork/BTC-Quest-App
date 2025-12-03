import React from 'react';
import TaskCard from './TaskCard';

function TaskList({ tasks, onCompleteTask, activeCategory }) {
  const filteredTasks = activeCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === activeCategory);

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3 className="empty-state-title">No tasks available</h3>
        <p>Check back later for new tasks or try a different category.</p>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {filteredTasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={onCompleteTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
