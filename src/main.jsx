import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// One-time migration: clear old sample data for fresh Oct 1 start
const MIGRATION_KEY = 'winter_arc_v2_clean_start';
if (!localStorage.getItem(MIGRATION_KEY)) {
  // Clear all old winter arc data
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('winter_arc_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  localStorage.setItem(MIGRATION_KEY, 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
