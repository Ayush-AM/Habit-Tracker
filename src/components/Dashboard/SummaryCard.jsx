import React from 'react';
import { Target, CheckCircle2, Flame, Award } from 'lucide-react';

export function SummaryCard({ completed, goal }) {
  const percent = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0;
  
  // Circumference for r=48 is 2 * PI * 48 = 301.59
  const circumference = 301.59;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let badgeText = "❄️ Ready to Start Your Winter Arc";
  let badgeClass = "badge-neutral";
  if (percent >= 80) {
    badgeText = "🔥 Exceptional! Winter Arc Elite";
    badgeClass = "badge-elite";
  } else if (percent >= 50) {
    badgeText = "⚡ Strong Momentum! Keep Going";
    badgeClass = "badge-strong";
  } else if (percent > 0) {
    badgeText = "🚀 Locked In • Consistency is Key";
    badgeClass = "badge-locked";
  }

  return (
    <div className="summary-hero-card">
      <div className="card-header-bar header-blue">
        <div className="card-header-title">
          <Award size={14} />
          <h3>MONTH SUMMARY</h3>
        </div>
        <span className="card-header-sub">Overall Progress</span>
      </div>

      <div className="summary-hero-content">
        <div className="donut-chart-container">
          <svg className="donut-svg" viewBox="0 0 120 120">
            <circle className="donut-track" cx="60" cy="60" r="48"></circle>
            <circle 
              className="donut-fill summary-fill" 
              cx="60" 
              cy="60" 
              r="48"
              style={{ strokeDashoffset: Math.max(0, strokeDashoffset) }}
            ></circle>
          </svg>
          <div className="donut-center-text">
            <span className="donut-percent">{percent}%</span>
          </div>
        </div>

        <div className="summary-stats-box">
          <div className="stat-unit">
            <div className="stat-unit-header">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span className="stat-label">COMPLETED</span>
            </div>
            <span className="stat-value text-completed">{completed}</span>
          </div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-unit">
            <div className="stat-unit-header">
              <Target size={12} className="text-blue-500" />
              <span className="stat-label">MONTH GOAL</span>
            </div>
            <span className="stat-value">{goal}</span>
          </div>
        </div>
      </div>

      <div className={`summary-footer-badge ${badgeClass}`}>
        <span>{badgeText}</span>
      </div>
    </div>
  );
}
