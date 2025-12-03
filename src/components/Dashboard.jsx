import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useLaserEyes } from '@omnisat/lasereyes-react';
import WalletConnect from './WalletConnect';
import StatsPanel from './StatsPanel';
import AchievementBadges from './AchievementBadges';
import DailyStreak from './DailyStreak';
import QuestList from './QuestList';
import Leaderboard from './Leaderboard';
import Confetti from './Confetti';
import './Dashboard.css';

// Constants for daily rewards
const STORAGE_KEY = 'btc_quest_user_data';
const XP_PER_LEVEL = 100;
const MAX_STREAK_MULTIPLIER = 50; // Max 50% bonus

// Memoized header component
const DashboardHeader = memo(function DashboardHeader() {
  return (
    <div className="logo-section">
      <div className="logo">
        <span className="logo-icon">₿</span>
        <span className="logo-text">BTC Quest</span>
      </div>
      <p className="tagline">Stack Sats. Level Up. Dominate.</p>
    </div>
  );
});

// Memoized welcome card
const WelcomeCard = memo(function WelcomeCard({ onDemoClick }) {
  return (
    <div className="welcome-card">
      <div className="welcome-icon">🚀</div>
      <h2>Ready to Begin Your Quest?</h2>
      <p>Connect your Bitcoin wallet to start earning XP, completing quests, and climbing the leaderboard!</p>
      <div className="feature-list">
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span>Earn XP & Level Up</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🏆</span>
          <span>Unlock Achievements</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🔥</span>
          <span>Build Daily Streaks</span>
        </div>
        <div className="feature">
          <span className="feature-icon">📊</span>
          <span>Compete on Leaderboard</span>
        </div>
      </div>
      <button className="btn btn-demo" onClick={onDemoClick}>
        <span className="demo-btn-icon">🎮</span>
        Try Demo Mode
      </button>
    </div>
  );
});

// Memoized demo banner
const DemoBanner = memo(function DemoBanner({ onExit }) {
  return (
    <div className="demo-banner">
      <span className="demo-icon">🎮</span>
      <span>Demo Mode - Connect wallet to save progress!</span>
      <button className="demo-exit" onClick={onExit}>Exit Demo</button>
    </div>
  );
});

// Load user data from localStorage
function loadUserData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return null;
}

// Save user data to localStorage
function saveUserData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

function Dashboard() {
  const { address, connected } = useLaserEyes();
  const [demoMode, setDemoMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: XP_PER_LEVEL,
    totalSats: 21000,
    questsCompleted: 0,
    streak: 0,
    rank: 42,
    lastLoginDate: null
  });
  
  const isActive = connected || demoMode;

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadUserData();
    if (savedData) {
      // Check and update streak
      const today = new Date().toDateString();
      const lastLogin = savedData.lastLoginDate;
      
      if (lastLogin) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastLogin === today) {
          // Same day, keep streak
          setUserStats(prev => ({ ...prev, ...savedData }));
        } else if (lastLogin === yesterday) {
          // Consecutive day, increment streak
          const newStreak = (savedData.streak || 0) + 1;
          const updatedData = { ...savedData, streak: newStreak, lastLoginDate: today };
          setUserStats(prev => ({ ...prev, ...updatedData }));
          saveUserData(updatedData);
        } else {
          // Streak broken, reset to 1
          const updatedData = { ...savedData, streak: 1, lastLoginDate: today };
          setUserStats(prev => ({ ...prev, ...updatedData }));
          saveUserData(updatedData);
        }
      } else {
        // First login
        const updatedData = { ...savedData, streak: 1, lastLoginDate: today };
        setUserStats(prev => ({ ...prev, ...updatedData }));
        saveUserData(updatedData);
      }
    }
  }, []);

  // Save data when stats change (debounced)
  useEffect(() => {
    if (userStats.questsCompleted > 0 || userStats.xp > 0) {
      const timeoutId = setTimeout(() => {
        saveUserData(userStats);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [userStats]);

  // Calculate XP gain with streak bonus
  const gainXP = useCallback((amount) => {
    setUserStats(prev => {
      // Apply streak bonus (up to MAX_STREAK_MULTIPLIER%)
      const streakBonus = Math.min(prev.streak * 5, MAX_STREAK_MULTIPLIER);
      const bonusXP = Math.floor(amount * (streakBonus / 100));
      const totalXP = amount + bonusXP;
      
      let newXP = prev.xp + totalXP;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;
      
      // Check for level up
      while (newXP >= newXpToNextLevel) {
        newXP -= newXpToNextLevel;
        newLevel += 1;
        newXpToNextLevel = Math.floor(XP_PER_LEVEL * Math.pow(1.5, newLevel - 1));
        
        // Show confetti on level up
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      return {
        ...prev,
        level: newLevel,
        xp: newXP,
        xpToNextLevel: newXpToNextLevel,
        questsCompleted: prev.questsCompleted + 1
      };
    });
  }, []);

  // Handle demo mode toggle
  const handleDemoMode = useCallback((value) => {
    setDemoMode(value);
  }, []);

  // Welcome bonus on wallet connect
  useEffect(() => {
    if (connected && address) {
      const timeoutId = setTimeout(() => {
        gainXP(25);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [connected, address, gainXP]);

  // Memoize the welcome click handler
  const handleWelcomeClick = useCallback(() => handleDemoMode(true), [handleDemoMode]);
  const handleDemoExit = useCallback(() => handleDemoMode(false), [handleDemoMode]);

  return (
    <div className="dashboard">
      {showConfetti && <Confetti />}
      
      <header className="dashboard-header">
        <DashboardHeader />
        <WalletConnect />
      </header>

      {isActive ? (
        <main className="dashboard-main">
          {demoMode && <DemoBanner onExit={handleDemoExit} />}
          
          <div className="stats-row">
            <StatsPanel stats={userStats} />
            <DailyStreak streak={userStats.streak} />
          </div>
          
          <div className="content-row">
            <div className="quests-section">
              <QuestList onComplete={gainXP} />
            </div>
            <div className="side-section">
              <AchievementBadges level={userStats.level} />
              <Leaderboard rank={userStats.rank} />
            </div>
          </div>
        </main>
      ) : (
        <main className="dashboard-welcome">
          <WelcomeCard onDemoClick={handleWelcomeClick} />
        </main>
      )}
    </div>
  );
}

export default memo(Dashboard);
