import React from 'react';

function Header({ points, streak }) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">₿</div>
        <h1>BTC Quest</h1>
      </div>
      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-icon">🪙</span>
          <div>
            <span className="stat-value">{points}</span>
            <span className="stat-label"> Points</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔥</span>
          <div>
            <span className="stat-value">{streak}</span>
            <span className="stat-label"> Day Streak</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
