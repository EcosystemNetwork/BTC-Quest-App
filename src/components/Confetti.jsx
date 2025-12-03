import React, { useEffect, useState } from 'react';

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#f7931a', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    const newParticles = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`
          }}
        />
      ))}
      <div className="level-up-text">
        <span className="level-up-emoji">🎉</span>
        <span>LEVEL UP!</span>
        <span className="level-up-emoji">🎉</span>
      </div>
    </div>
  );
}

export default Confetti;
