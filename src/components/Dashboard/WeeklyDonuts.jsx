import React from 'react';
import { Calendar } from 'lucide-react';

export function WeeklyDonuts({ weeklyStats }) {
  // Mini circumference for r=38 is 2 * PI * 38 = 238.76
  const miniCircumference = 238.76;

  const weekHeaders = [
    { num: 1, classKey: 'week1', fillClass: 'week1-fill', headerClass: 'header-week1' },
    { num: 2, classKey: 'week2', fillClass: 'week2-fill', headerClass: 'header-week2' },
    { num: 3, classKey: 'week3', fillClass: 'week3-fill', headerClass: 'header-week3' },
    { num: 4, classKey: 'week4', fillClass: 'week4-fill', headerClass: 'header-week4' },
    { num: 5, classKey: 'week5', fillClass: 'week5-fill', headerClass: 'header-week5' },
  ];

  return (
    <div className="weekly-cards-row">
      {weeklyStats.map((w, idx) => {
        if (w.daysInWeek === 0) return null;
        const config = weekHeaders[idx] || weekHeaders[0];
        const offset = miniCircumference - (w.percent / 100) * miniCircumference;

        return (
          <div key={w.weekNum} className={`week-stat-card card-${config.classKey}`}>
            <div className={`card-header-bar ${config.headerClass}`}>
              <h4>WEEK {w.weekNum}</h4>
            </div>

            <div className="mini-donut-container">
              <svg className="donut-svg" viewBox="0 0 100 100">
                <circle className="donut-track" cx="50" cy="50" r="38"></circle>
                <circle
                  className={`donut-fill ${config.fillClass}`}
                  cx="50"
                  cy="50"
                  r="38"
                  style={{ strokeDashoffset: Math.max(0, offset) }}
                ></circle>
              </svg>
              <div className="donut-center-text">
                <span className="donut-percent">{w.percent}%</span>
              </div>
            </div>

            <div className="week-range-text">{w.range}</div>
            <div className="week-completion-sub">
              {w.completed} / {w.totalHabitDays} Done
            </div>
          </div>
        );
      })}
    </div>
  );
}
