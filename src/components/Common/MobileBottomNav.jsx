import React from 'react';
import { CheckSquare, Table2, BarChart3, BookOpen } from 'lucide-react';

export function MobileBottomNav({ activeTab, setActiveTab, todayStats }) {
  const tabs = [
    {
      id: 'today',
      label: "Today's Focus",
      icon: CheckSquare,
      badge: todayStats ? `${todayStats.done}/${todayStats.total}` : null
    },
    {
      id: 'matrix',
      label: 'Matrix Grid',
      icon: Table2
    },
    {
      id: 'stats',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'log',
      label: 'Daily Log',
      icon: BookOpen
    }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={isActive}
              role="tab"
            >
              <div className="nav-item-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} />
                {tab.badge && !isActive && (
                  <span className="nav-item-mini-badge">{tab.badge}</span>
                )}
              </div>
              <span className="nav-item-label">{tab.label}</span>
              {isActive && <span className="nav-item-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
