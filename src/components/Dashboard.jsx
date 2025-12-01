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

  const calculateReward = (currentStreak) => {
    const streakBonus = Math.min(currentStreak, MAX_STREAK_BONUS);
    return BASE_REWARD + (streakBonus * 5);
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
                className={`day-circle ${day <= (streak % 7 || (streak > 0 ? 7 : 0)) ? 'completed' : ''}`}
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
