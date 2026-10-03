import React, { useRef, useEffect } from 'react';
import { BarChart3, MoveHorizontal } from 'lucide-react';

export function DailyBarChart({ daysInMonth, dailyCounts, maxHabitCount, todayDay, onSelectDay }) {
  const yMax = Math.max(maxHabitCount, 6);
  const step = Math.ceil(yMax / 4);
  const todayRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Y-axis markers
  const yLabels = [];
  for (let i = step * 4; i >= 0; i -= step) {
    yLabels.push(i);
  }

  // Days list
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Smoothly center on today's bar on mount or day change
  useEffect(() => {
    if (todayRef.current && scrollAreaRef.current) {
      try {
        const container = scrollAreaRef.current;
        const target = todayRef.current;
        const scrollLeft = target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
        container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      } catch (e) {
        try {
          todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (err) {
          // ignore
        }
      }
    }
  }, [todayDay]);

  return (
    <div className="chart-box daily-bar-card">
      <div className="card-header-bar header-blue">
        <div className="card-header-title">
          <BarChart3 size={15} />
          <h3>DAILY HABIT COUNT</h3>
        </div>
        <div className="header-legend-group">
          <span className="header-legend">Daily Completion Frequency</span>
          <span className="scroll-hint-pill" title="Scroll horizontally to see all days">
            <MoveHorizontal size={11} />
            <span>Scroll ↔</span>
          </span>
        </div>
      </div>

      <div className="daily-chart-wrapper">
        <div className="chart-y-axis">
          {yLabels.map(y => (
            <span key={y}>{y}</span>
          ))}
        </div>

        <div className="daily-bars-scroll-area" ref={scrollAreaRef}>
          <div className="daily-bars-container">
            {days.map(day => {
              const count = dailyCounts[day] || 0;
              const heightPercent = yMax > 0 ? Math.min(100, Math.round((count / (step * 4)) * 100)) : 0;
              const isToday = (day === todayDay);

              let barColor = 'var(--week1-accent)';
              if (day <= 7) { barColor = 'var(--week1-accent)'; }
              else if (day <= 14) { barColor = 'var(--week2-accent)'; }
              else if (day <= 21) { barColor = 'var(--week3-accent)'; }
              else if (day <= 28) { barColor = 'var(--week4-accent)'; }
              else { barColor = 'var(--week5-accent)'; }

              return (
                <div
                  key={day}
                  ref={isToday ? todayRef : null}
                  className={`day-bar-column ${isToday ? 'is-today' : ''}`}
                  title={`Day ${day}: ${count} habits crushed`}
                  onClick={() => onSelectDay && onSelectDay(day)}
                >
                  <div
                    className="bar-pill"
                    style={{
                      height: `${Math.max(4, heightPercent)}%`,
                      backgroundColor: barColor
                    }}
                  ></div>
                  <span className="bar-day-number">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="chart-x-legend">
        <span className="legend-chip week1-chip">W1 (1-7)</span>
        <span className="legend-chip week2-chip">W2 (8-14)</span>
        <span className="legend-chip week3-chip">W3 (15-21)</span>
        <span className="legend-chip week4-chip">W4 (22-28)</span>
        {daysInMonth > 28 && <span className="legend-chip week5-chip">W5 (29-{daysInMonth})</span>}
      </div>
    </div>
  );
}

export default DailyBarChart;
