// Sample tasks data for the BTC Quest App
export const initialTasks = [
  {
    id: 1,
    title: 'Complete Profile Setup',
    description: 'Fill in your profile information to unlock more features and earn your first reward.',
    category: 'onboarding',
    icon: '👤',
    reward: 50,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 2,
    title: 'Connect Your Wallet',
    description: 'Link your Bitcoin wallet to start receiving rewards directly to your address.',
    category: 'onboarding',
    icon: '🔗',
    reward: 100,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 3,
    title: 'Daily Check-in',
    description: 'Log in daily to earn bonus points and maintain your streak.',
    category: 'daily',
    icon: '📅',
    reward: 25,
    completed: false,
    difficulty: 'easy',
    recurring: true
  },
  {
    id: 4,
    title: 'Share on Social Media',
    description: 'Share BTC Quest on Twitter or other social platforms to earn rewards.',
    category: 'social',
    icon: '📢',
    reward: 75,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 5,
    title: 'Refer a Friend',
    description: 'Invite a friend to join BTC Quest and earn bonus points when they sign up.',
    category: 'social',
    icon: '👥',
    reward: 200,
    completed: false,
    difficulty: 'medium'
  },
  {
    id: 6,
    title: 'Complete First Transaction',
    description: 'Make your first transaction using the platform to unlock advanced features.',
    category: 'transactions',
    icon: '💸',
    reward: 150,
    completed: false,
    difficulty: 'medium'
  },
  {
    id: 7,
    title: 'Watch Educational Video',
    description: 'Learn about Bitcoin and blockchain by watching our educational content.',
    category: 'learning',
    icon: '🎓',
    reward: 50,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 8,
    title: 'Complete Quiz',
    description: 'Test your Bitcoin knowledge and earn rewards for correct answers.',
    category: 'learning',
    icon: '📝',
    reward: 100,
    completed: false,
    difficulty: 'medium'
  },
  {
    id: 9,
    title: 'Enable 2FA Security',
    description: 'Secure your account with two-factor authentication for bonus security points.',
    category: 'security',
    icon: '🔐',
    reward: 125,
    completed: false,
    difficulty: 'medium'
  },
  {
    id: 10,
    title: 'Join Community Discord',
    description: 'Join our Discord server to connect with other BTC Quest enthusiasts.',
    category: 'social',
    icon: '💬',
    reward: 50,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 11,
    title: 'Verify Email Address',
    description: 'Confirm your email to unlock all platform features and notifications.',
    category: 'onboarding',
    icon: '✉️',
    reward: 30,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 12,
    title: 'Reach Level 5',
    description: 'Accumulate enough points to reach Level 5 and unlock exclusive rewards.',
    category: 'milestones',
    icon: '🏆',
    reward: 500,
    completed: false,
    difficulty: 'hard'
  }
];

export const categories = [
  { id: 'all', name: 'All Tasks', icon: '📋' },
  { id: 'onboarding', name: 'Onboarding', icon: '🚀' },
  { id: 'daily', name: 'Daily', icon: '📅' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'transactions', name: 'Transactions', icon: '💸' },
  { id: 'learning', name: 'Learning', icon: '🎓' },
  { id: 'security', name: 'Security', icon: '🔐' },
  { id: 'milestones', name: 'Milestones', icon: '🏆' }
];

export const achievements = [
  { id: 1, name: 'First Steps', icon: '👣', description: 'Complete your first task', requirement: 1, type: 'tasks' },
  { id: 2, name: 'Task Master', icon: '⭐', description: 'Complete 5 tasks', requirement: 5, type: 'tasks' },
  { id: 3, name: 'Dedicated', icon: '🔥', description: 'Complete 10 tasks', requirement: 10, type: 'tasks' },
  { id: 4, name: 'Point Collector', icon: '💰', description: 'Earn 500 points', requirement: 500, type: 'points' },
  { id: 5, name: 'Wealthy', icon: '💎', description: 'Earn 1000 points', requirement: 1000, type: 'points' },
  { id: 6, name: 'Social Butterfly', icon: '🦋', description: 'Complete 3 social tasks', requirement: 3, type: 'social' }
];

export const rewards = [
  { id: 1, name: 'Exclusive Badge', icon: '🏅', cost: 200, description: 'Show off your achievements' },
  { id: 2, name: 'Profile Theme', icon: '🎨', cost: 300, description: 'Customize your profile look' },
  { id: 3, name: 'Early Access', icon: '🔑', cost: 500, description: 'Get early access to new features' },
  { id: 4, name: 'VIP Status', icon: '👑', cost: 1000, description: 'Unlock VIP benefits' }
];

export function calculateLevel(points) {
  // Level progression: each level requires more points
  // Level 1: 0-99, Level 2: 100-249, Level 3: 250-499, etc.
  if (points < 100) return { level: 1, currentPoints: points, nextLevelPoints: 100, progress: (points / 100) * 100 };
  if (points < 250) return { level: 2, currentPoints: points - 100, nextLevelPoints: 150, progress: ((points - 100) / 150) * 100 };
  if (points < 500) return { level: 3, currentPoints: points - 250, nextLevelPoints: 250, progress: ((points - 250) / 250) * 100 };
  if (points < 1000) return { level: 4, currentPoints: points - 500, nextLevelPoints: 500, progress: ((points - 500) / 500) * 100 };
  if (points < 2000) return { level: 5, currentPoints: points - 1000, nextLevelPoints: 1000, progress: ((points - 1000) / 1000) * 100 };
  return { level: Math.floor(points / 1000) + 4, currentPoints: points % 1000, nextLevelPoints: 1000, progress: ((points % 1000) / 1000) * 100 };
}
