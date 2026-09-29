import React, { useState } from 'react';
import { Check, Flame, Plus, Zap, CheckCircle2, Circle } from 'lucide-react';
import { HabitIcon } from '../Common/HabitIcon';

export function MobileDailyView({
  habits,
  checkData,
  todayDayNumber,
  selectedMonth,
  selectedYear,
  stats,
  onToggleDay,
  onOpenAddModal,
  onQuickFillToday
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'PENDING' | 'DONE'

  const activeDay = todayDayNumber || 1;

  // Habits with status for activeDay
  const habitsWithStatus = habits.map(h => {
    const isDone = !!(checkData[h.id] && checkData[h.id][activeDay]);
    const completedMonthCount = stats.habitCompletedCounts[h.id] || 0;
    const goal = parseInt(h.goal || 20, 10);
    const streak = stats.streaks[h.id] || 0;
    const progressPercent = goal > 0 ? Math.min(100, Math.round((completedMonthCount / goal) * 100)) : 0;

    return {
      ...h,
      isDone,
      completedMonthCount,
      goal,
      streak,
      progressPercent
    };
  });

  const doneCount = habitsWithStatus.filter(h => h.isDone).length;
  const totalCount = habits.length;
  const todayPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const filteredHabits = habitsWithStatus.filter(h => {
    if (filterMode === 'PENDING') return !h.isDone;
    if (filterMode === 'DONE') return h.isDone;
    return true;
  });

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="mobile-daily-view">
      {/* Mobile Top Summary Header */}
      <div className="mobile-view-header">
        <div className="mobile-header-info">
          <span className="mobile-header-subtitle">
            {todayDayNumber ? "TODAY'S DISCIPLINE LOG" : `DAY ${activeDay} LOG`}
          </span>
          <h3 className="mobile-header-title">
            {monthNames[selectedMonth]} {activeDay}, {selectedYear}
          </h3>
        </div>

        <div className="mobile-today-stat-pill">
          <span className="stat-pill-numbers">{doneCount}/{totalCount}</span>
          <span className="stat-pill-label">{todayPercent}% Done</span>
        </div>
      </div>

      {/* Daily Progress Bar */}
      <div className="mobile-daily-progress-bar">
        <div
          className="mobile-daily-progress-fill"
          style={{ width: `${todayPercent}%` }}
        ></div>
      </div>

      {/* Filter Tabs */}
      <div className="mobile-filter-tabs">
        <button
          className={`mobile-tab-btn ${filterMode === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterMode('ALL')}
        >
          All ({totalCount})
        </button>
        <button
          className={`mobile-tab-btn ${filterMode === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilterMode('PENDING')}
        >
          Pending ({totalCount - doneCount})
        </button>
        <button
          className={`mobile-tab-btn ${filterMode === 'DONE' ? 'active' : ''}`}
          onClick={() => setFilterMode('DONE')}
        >
          Done ({doneCount})
        </button>
      </div>

      {/* Habit Cards List */}
      <div className="mobile-habit-cards-list">
        {filteredHabits.length === 0 ? (
          <div className="mobile-empty-state">
            <CheckCircle2 size={36} className="text-emerald-500" />
            <p>
              {filterMode === 'PENDING'
                ? "All habits completed for today! Winter Arc locked in."
                : "No habits found in this view."}
            </p>
          </div>
        ) : (
          filteredHabits.map(habit => (
            <div
              key={habit.id}
              className={`mobile-habit-card ${habit.isDone ? 'card-completed' : ''}`}
              onClick={() => onToggleDay(habit.id, activeDay)}
            >
              <div className="mobile-card-main">
                <div
                  className="mobile-card-icon-wrap"
                  style={{
                    color: habit.color || 'var(--accent-primary)',
                    backgroundColor: habit.color ? `${habit.color}18` : 'var(--accent-primary-light)'
                  }}
                >
                  <HabitIcon name={habit.icon} size={20} />
                </div>

                <div className="mobile-card-details">
                  <div className="mobile-card-topline">
                    <span className="mobile-habit-name">{habit.name}</span>
                    {habit.streak > 0 && (
                      <span className="habit-streak compact-streak" title={`${habit.streak} day streak`}>
                        <Flame size={12} className="streak-icon" />
                        <span>{habit.streak}d</span>
                      </span>
                    )}
                  </div>

                  <div className="mobile-card-subline">
                    <span className="mobile-cat-pill">{habit.category}</span>
                    <span className="mobile-month-progress">
                      {habit.completedMonthCount}/{habit.goal} ({habit.progressPercent}%)
                    </span>
                  </div>

                  {/* Mini month progress line */}
                  <div className="mobile-mini-track">
                    <div
                      className="mobile-mini-fill"
                      style={{
                        width: `${habit.progressPercent}%`,
                        backgroundColor: habit.color || 'var(--accent-primary)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Big Touch Checkbox Button */}
                <div className="mobile-touch-checkbox-container">
                  <button
                    type="button"
                    className={`mobile-check-button ${habit.isDone ? 'checked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDay(habit.id, activeDay);
                    }}
                    aria-label={`Mark ${habit.name} ${habit.isDone ? 'incomplete' : 'complete'}`}
                  >
                    {habit.isDone ? <Check size={18} strokeWidth={3} /> : null}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Quick Action Bar on Mobile */}
      <div className="mobile-quick-actions">
        {doneCount < totalCount && (
          <button
            onClick={onQuickFillToday}
            className="mobile-action-btn primary-action"
          >
            <Zap size={16} />
            <span>Check All for Today</span>
          </button>
        )}

        <button
          onClick={onOpenAddModal}
          className="mobile-action-btn secondary-action"
        >
          <Plus size={16} />
          <span>New Habit</span>
        </button>
      </div>
    </div>
  );
}

export default MobileDailyView;
