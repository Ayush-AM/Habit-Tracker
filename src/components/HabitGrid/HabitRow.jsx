import React from 'react';
import { Flame, Edit3, Trash2 } from 'lucide-react';
import { HabitIcon } from '../Common/HabitIcon';

export function HabitRow({
  habit,
  daysInMonth,
  todayDayNumber,
  completedCount,
  streak,
  habitChecks,
  onToggleDay,
  onUpdateGoal,
  onEditHabit,
  onDeleteHabit
}) {
  const goal = parseInt(habit.goal || 20, 10);
  const progressPercent = goal > 0 ? Math.min(100, Math.round((completedCount / goal) * 100)) : 0;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <tr className="habit-table-row">
      {/* Habit Title & Streak */}
      <td className="td-habit-name sticky-col sticky-col-0">
        <div className="habit-title-wrap">
          <div 
            className="habit-name-left"
            onClick={() => onEditHabit(habit)}
            title={`Click to edit ${habit.name}`}
          >
            <span
              className="habit-icon-pill"
              style={{
                color: habit.color || 'var(--accent-primary)',
                backgroundColor: habit.color ? `${habit.color}18` : 'var(--accent-primary-light)'
              }}
            >
              <HabitIcon name={habit.icon} size={15} />
            </span>
            <div className="habit-name-block">
              <span className="habit-name-text" title={habit.name}>{habit.name}</span>
              <div className="habit-meta-mobile">
                <span className="mobile-progress-pill">{completedCount}/{goal}</span>
                {streak > 0 && (
                  <span className="habit-streak compact-streak" title={`${streak} day streak`}>
                    <Flame size={11} className="streak-icon" />
                    <span>{streak}d</span>
                  </span>
                )}
              </div>
            </div>
            {streak > 0 && (
              <span className="habit-streak desktop-streak" title={`${streak} day active streak!`}>
                <Flame size={12} className="streak-icon" />
                <span>{streak}</span>
              </span>
            )}
          </div>
          <div className="habit-row-actions" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="row-btn edit-row-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditHabit(habit);
              }}
              title={`Edit ${habit.name}`}
              aria-label={`Edit ${habit.name}`}
            >
              <Edit3 size={12} />
            </button>
            <button
              type="button"
              className="row-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteHabit(habit.id);
              }}
              title={`Delete ${habit.name}`}
              aria-label={`Delete ${habit.name}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </td>

      {/* Category Badge */}
      <td className="sticky-col sticky-col-1 col-category">
        <span className="category-badge">
          <HabitIcon name={habit.icon} size={12} />
          <span>{habit.category}</span>
        </span>
      </td>

      {/* Monthly Target Goal (Inline Editable) */}
      <td className="sticky-col sticky-col-2 col-goal">
        <input
          type="number"
          className="goal-input"
          value={habit.goal}
          min="1"
          max="31"
          title="Click to edit goal"
          onChange={(e) => onUpdateGoal(habit.id, e.target.value)}
        />
      </td>

      {/* Progress Bar */}
      <td className="sticky-col sticky-col-3 col-progress">
        <div className="progress-cell-box">
          <span className="progress-fraction">
            {completedCount}/{goal} ({progressPercent}%)
          </span>
          <div className="mini-progress-bar">
            <div
              className="mini-progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: habit.color || 'var(--accent-primary)'
              }}
            ></div>
          </div>
        </div>
      </td>

      {/* Checkbox Matrix Cells (1 to 31) */}
      {days.map(day => {
        const isChecked = !!(habitChecks && habitChecks[day]);
        const isToday = (day === todayDayNumber);

        let weekClass = 'week1-check';
        if (day <= 7) weekClass = 'week1-check';
        else if (day <= 14) weekClass = 'week2-check';
        else if (day <= 21) weekClass = 'week3-check';
        else if (day <= 28) weekClass = 'week4-check';
        else weekClass = 'week5-check';

        return (
          <td
            key={day}
            className={`habit-checkbox-cell ${isToday ? 'is-today' : ''}`}
            onClick={() => onToggleDay(habit.id, day)}
          >
            <input
              type="checkbox"
              className={`habit-checkbox ${weekClass}`}
              checked={isChecked}
              onChange={() => {}} // Handled by TD click
              title={`${habit.name} - Day ${day}`}
            />
          </td>
        );
      })}
    </tr>
  );
}
