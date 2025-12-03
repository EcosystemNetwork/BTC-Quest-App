import React, { useState } from 'react';

const QUESTS = [
  {
    id: 1,
    title: 'Welcome Aboard',
    description: 'Connect your Bitcoin wallet to get started',
    xpReward: 25,
    type: 'onboarding',
    icon: '🎯',
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'Stack Your First Sat',
    description: 'Receive any amount of Bitcoin to your connected wallet',
    xpReward: 50,
    type: 'transaction',
    icon: '💰',
    difficulty: 'Easy'
  },
  {
    id: 3,
    title: 'Diamond Discipline',
    description: 'Login for 7 consecutive days',
    xpReward: 100,
    type: 'streak',
    icon: '💎',
    difficulty: 'Medium'
  },
  {
    id: 4,
    title: 'Network Explorer',
    description: 'View your transaction history',
    xpReward: 30,
    type: 'exploration',
    icon: '🔍',
    difficulty: 'Easy'
  },
  {
    id: 5,
    title: 'Community Champion',
    description: 'Share your quest progress on social media',
    xpReward: 75,
    type: 'social',
    icon: '📢',
    difficulty: 'Medium'
  },
  {
    id: 6,
    title: 'HODLer Elite',
    description: 'Hold Bitcoin for 30 days without moving',
    xpReward: 200,
    type: 'hodl',
    icon: '🏆',
    difficulty: 'Hard'
  },
];

function QuestList({ onComplete }) {
  const [completedQuests, setCompletedQuests] = useState(new Set([1]));
  const [animatingQuest, setAnimatingQuest] = useState(null);

  const handleClaim = (quest) => {
    if (completedQuests.has(quest.id)) return;
    
    setAnimatingQuest(quest.id);
    setTimeout(() => {
      setCompletedQuests(prev => new Set([...prev, quest.id]));
      onComplete(quest.xpReward);
      setAnimatingQuest(null);
    }, 600);
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return '';
    }
  };

  return (
    <div className="quests-panel">
      <div className="quests-header">
        <h3 className="panel-title">
          <span className="title-icon">📋</span>
          Active Quests
        </h3>
        <span className="quest-count">
          {completedQuests.size}/{QUESTS.length} Complete
        </span>
      </div>
      
      <div className="quest-list">
        {QUESTS.map(quest => {
          const isCompleted = completedQuests.has(quest.id);
          const isAnimating = animatingQuest === quest.id;
          
          return (
            <div
              key={quest.id}
              className={`quest-card ${isCompleted ? 'completed' : ''} ${isAnimating ? 'claiming' : ''}`}
            >
              <div className="quest-icon-wrap">
                <span className="quest-icon">{quest.icon}</span>
              </div>
              <div className="quest-content">
                <div className="quest-header">
                  <h4 className="quest-title">{quest.title}</h4>
                  <span className={`quest-difficulty ${getDifficultyClass(quest.difficulty)}`}>
                    {quest.difficulty}
                  </span>
                </div>
                <p className="quest-description">{quest.description}</p>
                <div className="quest-reward">
                  <span className="reward-icon">⚡</span>
                  <span className="reward-amount">+{quest.xpReward} XP</span>
                </div>
              </div>
              <button
                className={`quest-action ${isCompleted ? 'claimed' : 'claim'}`}
                onClick={() => handleClaim(quest)}
                disabled={isCompleted || isAnimating}
              >
                {isAnimating ? (
                  <span className="claiming-spinner">⏳</span>
                ) : isCompleted ? (
                  <>✓ Claimed</>
                ) : (
                  <>Claim</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestList;
