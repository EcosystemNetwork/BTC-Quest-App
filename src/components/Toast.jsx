import React from 'react';

function Toast({ message, type, points, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '🎉' : '⚠️'}
      </span>
      <div>
        <span className="toast-message">{message}</span>
        {points > 0 && (
          <span className="toast-points"> +{points} points!</span>
        )}
      </div>
    </div>
  );
}

export default Toast;
