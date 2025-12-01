// API endpoint for task management
// This can be extended for database integration in production

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Task templates (used to generate tasks for each user)
const taskTemplates = [
  {
    id: 1,
    title: 'Complete Profile Setup',
    description: 'Fill in your profile information to unlock more features and earn your first reward.',
    category: 'onboarding',
    icon: '👤',
    reward: 50,
    difficulty: 'easy'
  },
  {
    id: 2,
    title: 'Connect Your Wallet',
    description: 'Link your Bitcoin wallet to start receiving rewards directly to your address.',
    category: 'onboarding',
    icon: '🔗',
    reward: 100,
    difficulty: 'easy'
  },
  {
    id: 3,
    title: 'Daily Check-in',
    description: 'Log in daily to earn bonus points and maintain your streak.',
    category: 'daily',
    icon: '📅',
    reward: 25,
    difficulty: 'easy',
    recurring: true
  }
];

// In-memory storage per user (replace with database in production)
const userTasks = {};
const userPoints = {};

// Get tasks for user (initialize if needed)
function getTasksForUser(userId) {
  if (!userTasks[userId]) {
    userTasks[userId] = taskTemplates.map(task => ({
      ...task,
      completed: false
    }));
  }
  return userTasks[userId];
}

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const userId = req.query.userId || 'anonymous';
  const tasks = getTasksForUser(userId);
  res.json({ success: true, tasks });
});

// Complete a task
app.post('/api/tasks/:id/complete', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const userId = req.body.userId || 'anonymous';
  
  const tasks = getTasksForUser(userId);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }
  
  if (task.completed && !task.recurring) {
    return res.status(400).json({ success: false, error: 'Task already completed' });
  }
  
  // Update task status for this user
  task.completed = true;
  
  // Award points
  userPoints[userId] = (userPoints[userId] || 0) + task.reward;
  
  res.json({ 
    success: true, 
    task,
    points: userPoints[userId],
    reward: task.reward
  });
});

// Get user points
app.get('/api/points/:userId', (req, res) => {
  const userId = req.params.userId;
  res.json({ 
    success: true, 
    points: userPoints[userId] || 0 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

export default app;
