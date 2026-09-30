import React from 'react';
import { Search, Table2, CheckSquare, Layers } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../types/habit';
import { HabitIcon } from '../Common/HabitIcon';

export function TableToolbar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  viewMode = 'grid',
  setViewMode
}) {
  const categories = [{ name: "ALL", icon: "Layers" }, ...HABIT_CATEGORIES];

  return (
    <div className="table-toolbar">
      <div className="toolbar-left">
        {/* View Mode Toggle: Grid vs Daily Checklist */}
        {setViewMode && (
          <div className="view-mode-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Spreadsheet 92-Day Matrix"
            >
              <Table2 size={14} />
              <span className="view-btn-label">Matrix Grid</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
              title="Today's Mobile Checklist"
            >
              <CheckSquare size={14} />
              <span className="view-btn-label">Today's Focus</span>
            </button>
          </div>
        )}

        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filter-chips">
          {categories.slice(0, 7).map(cat => (
            <button
              key={cat.name}
              className={`filter-chip ${categoryFilter === cat.name ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat.name)}
            >
              <HabitIcon name={cat.icon} size={13} />
              <span>{cat.name === 'ALL' ? 'All' : cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableToolbar;
