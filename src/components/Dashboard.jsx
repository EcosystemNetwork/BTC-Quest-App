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
    </div>
  );
}

export default Dashboard;
