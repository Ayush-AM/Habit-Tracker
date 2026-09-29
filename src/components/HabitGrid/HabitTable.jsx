import React from 'react';
import { HabitRow } from './HabitRow';
import { DAY_LETTERS } from '../../types/habit';

export function HabitTable({
  habits,
  checkData,
  daysInMonth,
  todayDayNumber,
  selectedYear,
  selectedMonth,
  stats,
  searchQuery,
  categoryFilter,
  onToggleDay,
  onUpdateGoal,
  onEditHabit,
  onDeleteHabit,
  onOpenAddModal
}) {
  const filteredHabits = habits.filter(h => {
    const matchCat = (categoryFilter === 'ALL' || h.category === categoryFilter);
    const matchSearch = (!searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchCat && matchSearch;
  });

  const getDayLetter = (day) => {
    const d = new Date(selectedYear, selectedMonth, day).getDay();
    return DAY_LETTERS[d];
  };

  // Week column spans
  const week1Span = Math.min(7, daysInMonth);
  const week2Span = Math.max(0, Math.min(14, daysInMonth) - 7);
  const week3Span = Math.max(0, Math.min(21, daysInMonth) - 14);
  const week4Span = Math.max(0, Math.min(28, daysInMonth) - 21);
  const week5Span = Math.max(0, daysInMonth - 28);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid-table-container">
      <div className="table-scroll-wrapper">
        <table className="habit-grid-table">
          <thead>
            {/* Top Row: Habits, Category, Goal, Progress, Week Spans */}
            <tr>
              <th rowSpan={2} className="th-habit-name sticky-col sticky-col-0">HABITS</th>
              <th rowSpan={2} className="th-category sticky-col sticky-col-1">CATEGORY</th>
              <th rowSpan={2} className="th-goal sticky-col sticky-col-2">MONTH GOAL</th>
              <th rowSpan={2} className="th-progress sticky-col sticky-col-3">PROGRESS</th>

              {week1Span > 0 && <th colSpan={week1Span} className="th-week-group-1">WEEK 1</th>}
              {week2Span > 0 && <th colSpan={week2Span} className="th-week-group-2">WEEK 2</th>}
              {week3Span > 0 && <th colSpan={week3Span} className="th-week-group-3">WEEK 3</th>}
              {week4Span > 0 && <th colSpan={week4Span} className="th-week-group-4">WEEK 4</th>}
              {week5Span > 0 && <th colSpan={week5Span} className="th-week-group-5">WEEK 5</th>}
            </tr>

            {/* Second Row: Day Letters & Numbers */}
            <tr>
              {days.map(day => {
                const dayLetter = getDayLetter(day);
                const isToday = (day === todayDayNumber);

                let weekNum = 1;
                if (day <= 7) weekNum = 1;
                else if (day <= 14) weekNum = 2;
                else if (day <= 21) weekNum = 3;
                else if (day <= 28) weekNum = 4;
                else weekNum = 5;

                return (
                  <th
                    key={day}
                    className={`th-day-cell th-week-group-${weekNum} ${isToday ? 'is-today' : ''}`}
                    title={`Day ${day} (${dayLetter})`}
                  >
                    <div className="th-day-name">{dayLetter}</div>
                    <div className="th-day-num">{day}</div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {filteredHabits.length === 0 ? (
              <tr>
                <td colSpan={4 + daysInMonth} className="empty-table-cell">
                  <p>No habits match your search filter.</p>
                  <button onClick={onOpenAddModal} className="action-btn primary-btn mt-2">
                    + Add New Habit
                  </button>
                </td>
              </tr>
            ) : (
              filteredHabits.map(habit => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  daysInMonth={daysInMonth}
                  todayDayNumber={todayDayNumber}
                  completedCount={stats.habitCompletedCounts[habit.id] || 0}
                  streak={stats.streaks[habit.id] || 0}
                  habitChecks={checkData[habit.id]}
                  onToggleDay={onToggleDay}
                  onUpdateGoal={onUpdateGoal}
                  onEditHabit={onEditHabit}
                  onDeleteHabit={onDeleteHabit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
