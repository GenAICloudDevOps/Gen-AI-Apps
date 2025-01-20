import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add global styles
const globalStylesElement = document.createElement('style');
globalStylesElement.innerHTML = `
  html { scroll-behavior: smooth; }
  *:focus { outline: 2px solid #8B5CF6; outline-offset: 2px; }
  @media (prefers-reduced-motion) {
    * { transition: none !important; animation: none !important; }
  }
`;
document.head.appendChild(globalStylesElement);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
