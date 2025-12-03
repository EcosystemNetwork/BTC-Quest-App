import React from 'react';

function RewardsSection({ rewards, userPoints, onRedeem }) {
  return (
    <div className="rewards-section">
      <h2 className="section-title">🎁 Rewards Store</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Redeem your points for exclusive rewards
      </p>
      <div className="rewards-grid">
        {rewards.map(reward => {
          const canAfford = userPoints >= reward.cost;
          return (
            <div key={reward.id} className="reward-card">
              <div className="reward-card-icon">{reward.icon}</div>
              <h3 className="reward-card-title">{reward.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {reward.description}
              </p>
              <p className="reward-card-cost">{reward.cost} points</p>
              <button
                className="task-button"
                style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem' }}
                disabled={!canAfford}
                onClick={() => onRedeem && onRedeem(reward)}
              >
                {canAfford ? 'Redeem' : 'Not Enough Points'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RewardsSection;
