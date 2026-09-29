import React from 'react';
import { Layers } from 'lucide-react';
import { HabitIcon } from '../Common/HabitIcon';

export function CategoryProgress({ categoryStats }) {
  return (
    <div className="chart-box category-progress-card">
      <div className="card-header-bar header-blue">
        <div className="card-header-title">
          <Layers size={15} />
          <h3>HABIT COUNT BY CATEGORY</h3>
        </div>
        <div className="category-legend">
          <span className="legend-dot completed-dot"></span> Completed
          <span className="legend-dot goal-dot"></span> Remaining Goal
        </div>
      </div>

      <div className="category-bars-list">
        {categoryStats.length === 0 ? (
          <div className="empty-state">No categories available</div>
        ) : (
          categoryStats.map(cat => {
            const percent = cat.goal > 0 ? Math.min(100, Math.round((cat.completed / cat.goal) * 100)) : 0;
            return (
              <div key={cat.name} className="category-progress-item">
                <div className="cat-name-badge" title={cat.name}>
                  <HabitIcon name={cat.icon} size={13} color={cat.color} />
                  <span className="cat-name-text">{cat.name}</span>
                </div>
                <div
                  className="cat-track"
                  title={`${cat.completed} completed / ${cat.goal} goal (${percent}%)`}
                >
                  <div
                    className="cat-progress-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: cat.color || 'var(--accent-primary)'
                    }}
                  ></div>
                </div>
                <div className="cat-counts-text">
                  <span>{cat.completed}/{cat.goal}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CategoryProgress;
