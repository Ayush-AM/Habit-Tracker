import React from 'react';
import { Flame, Edit3, Trash2 } from 'lucide-react';

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
          <div className="habit-name-left">
            <span className="habit-icon">{habit.icon || '⚡'}</span>
            <span className="habit-name-text">{habit.name}</span>
            {streak > 0 && (
              <span className="habit-streak" title={`${streak} day active streak!`}>
                <Flame size={12} className="streak-icon" />
                <span>{streak}</span>
              </span>
            )}
          </div>
          <div className="habit-row-actions">
            <button
              className="row-btn"
              onClick={() => onEditHabit(habit)}
              title="Edit habit"
            >
              <Edit3 size={13} />
            </button>
            <button
              className="row-btn delete-btn"
              onClick={() => onDeleteHabit(habit.id)}
              title="Delete habit"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </td>

      {/* Category Badge */}
      <td className="sticky-col sticky-col-1">
        <span className="category-badge">
          <span>{habit.icon || '📌'}</span>
          <span>{habit.category}</span>
        </span>
      </td>

      {/* Monthly Target Goal (Inline Editable) */}
      <td className="sticky-col sticky-col-2">
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
      <td className="sticky-col sticky-col-3">
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
              onChange={() => {}} // Handled by TD click for better hit target
              title={`${habit.name} - Day ${day}`}
            />
          </td>
        );
      })}
    </tr>
  );
}
