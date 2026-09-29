import React from 'react';
import { Search, Zap, RotateCcw, Filter } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../types/habit';

export function TableToolbar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onQuickFillToday,
  onResetMonth
}) {
  const categories = [{ name: "ALL", icon: "🌐" }, ...HABIT_CATEGORIES];

  return (
    <div className="table-toolbar">
      <div className="toolbar-left">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search habits or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filter-chips">
          {categories.slice(0, 6).map(cat => (
            <button
              key={cat.name}
              className={`filter-chip ${categoryFilter === cat.name ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat.name)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name === 'ALL' ? 'All Habits' : cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-right">
        <button
          onClick={onQuickFillToday}
          className="pill-btn highlight-pill"
          title="Mark all habits for today"
        >
          <Zap size={14} />
          <span>Check All Today</span>
        </button>

        <button
          onClick={onResetMonth}
          className="pill-btn danger-pill"
          title="Reset checkmarks for current month"
        >
          <RotateCcw size={14} />
          <span>Reset Month</span>
        </button>
      </div>
    </div>
  );
}
