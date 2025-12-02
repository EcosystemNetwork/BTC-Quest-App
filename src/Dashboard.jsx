import { useState } from 'react';

const socialTasks = [
  {
    id: 1,
    title: 'Follow us on Twitter',
    description: 'Follow @BTCQuest on Twitter for the latest updates',
    reward: 50,
    link: 'https://twitter.com/BTCQuest',
    icon: '🐦',
  },
  {
    id: 2,
    title: 'Join our Discord',
    description: 'Join the BTC Quest community on Discord',
    reward: 75,
    link: 'https://discord.gg/btcquest',
    icon: '💬',
  },
  {
    id: 3,
    title: 'Share on Twitter',
    description: 'Share your BTC Quest journey with friends',
    reward: 100,
    link: 'https://twitter.com/intent/tweet?text=I%20just%20joined%20BTC%20Quest!%20%23BTCQuest',
    icon: '📢',
  },
  {
    id: 4,
    title: 'Subscribe to Newsletter',
    description: 'Get weekly updates and exclusive rewards',
    reward: 25,
    link: 'https://btcquest.io/newsletter',
    icon: '📧',
  },
  {
    id: 5,
    title: 'Join Telegram Group',
    description: 'Connect with other BTC Quest members',
    reward: 50,
    link: 'https://t.me/btcquest',
    icon: '✈️',
  },
];

function Dashboard({ address, onDisconnect }) {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleTaskClick = (task) => {
    // Open the task link in a new tab
    window.open(task.link, '_blank', 'noopener,noreferrer');

    // Note: In production, task completion should be verified via backend API
    // that checks social platform APIs (Twitter API, Discord bot, etc.)
    // This simplified version marks tasks as complete after clicking for demo purposes
    if (!completedTasks.includes(task.id)) {
      setCompletedTasks([...completedTasks, task.id]);
      setTotalPoints(totalPoints + task.reward);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h1>BTC Quest</h1>
        </div>
        <div className="user-info">
          <span className="points">🏆 {totalPoints} Points</span>
          <span className="address">{shortenAddress(address)}</span>
          <button className="disconnect-btn" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to Your Dashboard</h2>
          <p>Complete social tasks to earn BTC Quest points!</p>
        </div>

        <div className="tasks-section">
          <h3>📋 Social Tasks</h3>
          <div className="tasks-grid">
            {socialTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`task-card ${isCompleted ? 'completed' : ''}`}
                  onClick={() => !isCompleted && handleTaskClick(task)}
                >
                  <div className="task-icon">{task.icon}</div>
                  <div className="task-content">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-reward">
                      <span className="reward-badge">+{task.reward} pts</span>
                      {isCompleted && <span className="completed-badge">✓ Done</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-value">{completedTasks.length}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{socialTasks.length - completedTasks.length}</span>
            <span className="stat-label">Tasks Remaining</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalPoints}</span>
            <span className="stat-label">Total Points</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
