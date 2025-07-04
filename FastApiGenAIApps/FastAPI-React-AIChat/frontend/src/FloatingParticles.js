import React from 'react';
import './FloatingParticles.css';

const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      className={`particle particle-${i % 5}`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }}
    />
  ));

  return <div className="floating-particles">{particles}</div>;
};

export default FloatingParticles;
