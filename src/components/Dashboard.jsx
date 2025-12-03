import React, { useState, useEffect, useCallback } from 'react';
import { useLaserEyes } from '@omnisat/lasereyes-react';
import WalletConnect from './WalletConnect';
import StatsPanel from './StatsPanel';
import AchievementBadges from './AchievementBadges';
import DailyStreak from './DailyStreak';
import QuestList from './QuestList';
import Leaderboard from './Leaderboard';
import Confetti from './Confetti';

function Dashboard() {
  const { address, connected } = useLaserEyes();
  const [demoMode, setDemoMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalSats: 21000,
    questsCompleted: 0,
    streak: 3,
    rank: 42
  });
  
  const isActive = connected || demoMode;

  // Simulate XP gain for dopamine effect
  const gainXP = useCallback((amount) => {
    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const levelUp = newXP >= prev.xpToNextLevel;
      
      if (levelUp) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        return {
          ...prev,
          level: prev.level + 1,
          xp: newXP - prev.xpToNextLevel,
          xpToNextLevel: Math.floor(prev.xpToNextLevel * 1.5)
        };
      }
      
      return { ...prev, xp: newXP };
    });
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

  return (
    <div className="dashboard">
      {showConfetti && <Confetti />}
      
      <header className="dashboard-header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">₿</span>
            <span className="logo-text">BTC Quest</span>
          </div>
          <p className="tagline">Stack Sats. Level Up. Dominate.</p>
        </div>
        <WalletConnect />
      </header>

      {isActive ? (
        <main className="dashboard-main">
          {demoMode && (
            <div className="demo-banner">
              <span className="demo-icon">🎮</span>
              <span>Demo Mode - Connect wallet to save progress!</span>
              <button className="demo-exit" onClick={() => setDemoMode(false)}>Exit Demo</button>
            </div>
          )}
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
            <button className="btn btn-demo" onClick={() => setDemoMode(true)}>
              <span className="demo-btn-icon">🎮</span>
              Try Demo Mode
            </button>
          </div>
        </main>
      )}

      <footer className="dashboard-footer">
        <p>Built with ₿itcoin Love | Powered by LaserEyes</p>
      </footer>
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const STORAGE_KEY = 'btc_quest_daily_reward';
const BASE_REWARD = 10; // Base satoshis reward
const MAX_STREAK_BONUS = 7; // Maximum streak days for bonus calculation

function Dashboard() {
  const [streak, setStreak] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [lastClaimDate, setLastClaimDate] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  useEffect(() => {
    loadRewardData();
  }, []);

  useEffect(() => {
    checkCanClaim();
  }, [lastClaimDate]);

  const loadRewardData = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        setStreak(data.streak || 0);
        setTotalRewards(data.totalRewards || 0);
        setLastClaimDate(data.lastClaimDate || null);
      }
    } catch (error) {
      console.error('Error loading reward data:', error);
    }
  };

  const saveRewardData = (newStreak, newTotalRewards, newLastClaimDate) => {
    try {
      const data = {
        streak: newStreak,
        totalRewards: newTotalRewards,
        lastClaimDate: newLastClaimDate,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving reward data:', error);
    }
  };

  const getDateString = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  const checkCanClaim = () => {
    if (!lastClaimDate) {
      setCanClaim(true);
      return;
    }

    const today = getDateString(new Date());
    const lastClaim = getDateString(new Date(lastClaimDate));
    
    setCanClaim(today !== lastClaim);
  };

  const calculateReward = (dayNumber) => {
    // Reward increases with each day up to MAX_STREAK_BONUS days
    const dayInCycle = Math.min(dayNumber, MAX_STREAK_BONUS);
    return BASE_REWARD + (dayInCycle * 5);
  };

  const isConsecutiveDay = (lastDate) => {
    if (!lastDate) return true;
    
    const today = new Date();
    const last = new Date(lastDate);
    
    // Reset time to midnight for comparison
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - last.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    return diffDays === 1;
  };

  const claimReward = () => {
    if (!canClaim) return;

    const today = new Date().toISOString();
    let newStreak;

    if (isConsecutiveDay(lastClaimDate)) {
      newStreak = streak + 1;
    } else if (!lastClaimDate) {
      newStreak = 1;
    } else {
      // Streak broken - reset to 1
      newStreak = 1;
    }

    const reward = calculateReward(newStreak);
    const newTotalRewards = totalRewards + reward;

    setStreak(newStreak);
    setTotalRewards(newTotalRewards);
    setLastClaimDate(today);
    setCanClaim(false);
    setJustClaimed(true);

    saveRewardData(newStreak, newTotalRewards, today);

    // Reset the "just claimed" animation after a delay
    setTimeout(() => setJustClaimed(false), 2000);
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const nextReward = calculateReward(canClaim ? (isConsecutiveDay(lastClaimDate) ? streak + 1 : 1) : streak);

  return (
    <div className="dashboard">
      <section className="dashboard-section rewards-section">
        <h2>Daily Login Rewards</h2>
        <p className="section-description">
          Login every day to earn rewards and build your streak!
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-info">
              <span className="stat-value">{streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">₿</span>
            <div className="stat-info">
              <span className="stat-value">{formatNumber(totalRewards)}</span>
              <span className="stat-label">Total Satoshis</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎁</span>
            <div className="stat-info">
              <span className="stat-value">{nextReward}</span>
              <span className="stat-label">{canClaim ? 'Next Reward' : 'Current Bonus'}</span>
            </div>
          </div>
        </div>

        <div className="claim-section">
          <button 
            className={`claim-button ${!canClaim ? 'claimed' : ''} ${justClaimed ? 'just-claimed' : ''}`}
            onClick={claimReward}
            disabled={!canClaim}
          >
            {justClaimed ? (
              <>✓ Claimed!</>
            ) : canClaim ? (
              <>🎁 Claim Daily Reward</>
            ) : (
              <>✓ Come Back Tomorrow</>
            )}
          </button>
          
          {!canClaim && !justClaimed && (
            <p className="next-claim-info">
              You've already claimed today's reward. Come back tomorrow to continue your streak!
            </p>
          )}
        </div>

        <div className="streak-calendar">
          <h3>Weekly Progress</h3>
          <div className="week-days">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className={`day-circle ${day <= (streak % 7 === 0 && streak > 0 ? 7 : streak % 7) ? 'completed' : ''}`}
              >
                <span className="day-number">{day}</span>
                <span className="day-reward">+{BASE_REWARD + day * 5}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
