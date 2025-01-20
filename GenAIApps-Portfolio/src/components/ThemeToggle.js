import React from 'react';

const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '10px',
      borderRadius: '50%',
      background: isDark ? '#fff' : '#000',
      color: isDark ? '#000' : '#fff',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}
  >
    {isDark ? '☀️' : '🌙'}
  </button>
);

export default ThemeToggle;
