import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProgressCard from './components/ProgressCard';
import TaskList from './components/TaskList';
import CategoryFilters from './components/CategoryFilters';
import Achievements from './components/Achievements';
import RewardsSection from './components/RewardsSection';
import Toast from './components/Toast';
import { initialTasks, categories, achievements, rewards } from './data/tasks';

// Local storage keys
const STORAGE_KEYS = {
  TASKS: 'btc_quest_tasks',
  POINTS: 'btc_quest_points',
  STREAK: 'btc_quest_streak',
  LAST_LOGIN: 'btc_quest_last_login'
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState({ message: '', type: '', points: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load data from local storage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
        const savedPoints = localStorage.getItem(STORAGE_KEYS.POINTS);
        const savedStreak = localStorage.getItem(STORAGE_KEYS.STREAK);
        const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);

        // Load tasks or use initial tasks
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          setTasks(initialTasks);
        }

        // Load points
        if (savedPoints) {
          setPoints(parseInt(savedPoints, 10));
        }

        // Calculate streak
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastLogin === today) {
          // Same day, keep streak
          setStreak(parseInt(savedStreak, 10) || 1);
        } else if (lastLogin === yesterday) {
          // Consecutive day, increment streak
          const newStreak = (parseInt(savedStreak, 10) || 0) + 1;
          setStreak(newStreak);
          localStorage.setItem(STORAGE_KEYS.STREAK, newStreak.toString());
        } else if (lastLogin) {
          // Streak broken
          setStreak(1);
          localStorage.setItem(STORAGE_KEYS.STREAK, '1');
        }

        // Update last login
        localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, today);
      } catch (error) {
        console.error('Error loading data:', error);
        setTasks(initialTasks);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save tasks to local storage when they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Save points to local storage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINTS, points.toString());
  }, [points]);

  // Show toast notification
  const showToast = useCallback((message, type = 'success', earnedPoints = 0) => {
    setToast({ message, type, points: earnedPoints });
    setTimeout(() => {
      setToast({ message: '', type: '', points: 0 });
    }, 3000);
  }, []);

  // Complete a task
  const handleCompleteTask = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    // Mark task as completed
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      )
    );

    // Update points
    setPoints(prev => prev + task.reward);

    // Show success toast
    showToast(`Task "${task.title}" completed!`, 'success', task.reward);
  }, [tasks, showToast]);

  // Redeem a reward
  const handleRedeemReward = useCallback((reward) => {
    if (points >= reward.cost) {
      setPoints(prev => prev - reward.cost);
      showToast(`Redeemed "${reward.name}"!`, 'success', 0);
    }
  }, [points, showToast]);

  // Calculate stats
  const tasksCompleted = tasks.filter(t => t.completed).length;
  const socialTasksCompleted = tasks.filter(t => t.completed && t.category === 'social').length;

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header points={points} streak={streak} />
      
      <main className="main-content">
        <div className="dashboard">
          <ProgressCard 
            points={points} 
            tasksCompleted={tasksCompleted}
            totalTasks={tasks.length}
          />

          <section className="tasks-section">
            <h2 className="section-title">📋 Available Tasks</h2>
            <CategoryFilters 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <TaskList 
              tasks={tasks}
              onCompleteTask={handleCompleteTask}
              activeCategory={activeCategory}
            />
          </section>

          <Achievements 
            achievements={achievements}
            tasksCompleted={tasksCompleted}
            points={points}
            socialTasksCompleted={socialTasksCompleted}
          />

          <RewardsSection 
            rewards={rewards}
            userPoints={points}
            onRedeem={handleRedeemReward}
          />
        </div>
      </main>

      <Toast 
        message={toast.message}
        type={toast.type}
        points={toast.points}
      />
import React from 'react';
import { LaserEyesProvider, useLaserEyes, UNISAT } from '@omnisat/lasereyes-react';
import './App.css';

function WalletConnect() {
  const { connect, disconnect, address, isConnected } = useLaserEyes();

  const handleConnect = async () => {
    try {
      await connect(UNISAT);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <div className="wallet-container">
      <h1>BTC Quest</h1>
      <p className="subtitle">Connect your Bitcoin wallet to get started</p>
      
      {isConnected ? (
        <div className="connected-section">
          <div className="address-display">
            <span className="label">Connected:</span>
            <span className="address">{address?.slice(0, 8)}...{address?.slice(-8)}</span>
          </div>
          <button className="wallet-button disconnect" onClick={handleDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button className="wallet-button connect" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;
