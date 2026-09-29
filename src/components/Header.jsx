import React, { useState } from 'react';
import { 
  Snowflake, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  BellOff, 
  Palette, 
  Download, 
  Plus, 
  CalendarDays 
} from 'lucide-react';
import { MONTH_NAMES } from '../types/habit';
import { HabitIcon } from './Common/HabitIcon';

export function Header({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  soundEnabled,
  toggleSound,
  theme,
  setTheme,
  currentThemeObj,
  themes,
  onExportCsv,
  onOpenAddModal
}) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  };

  // Calculate day in Winter Arc (Oct 1 to Dec 31 = 92 days)
  const now = new Date();
  const arcStart = new Date(2026, 9, 1); // Oct 1
  const arcEnd = new Date(2026, 11, 31); // Dec 31
  const totalArcDays = 92;
  const diffMs = now - arcStart;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const arcDay = diffDays < 1 ? 0 : Math.min(diffDays, totalArcDays);
  const arcStarted = now >= arcStart;
  const arcEnded = now > arcEnd;

  return (
    <header className="app-header">
      {/* Brand & Winter Arc Badge */}
      <div className="header-left">
        <div className="logo-badge">
          <div className="logo-icon-wrap">
            <Snowflake className="logo-snowflake" size={24} />
          </div>
          <div className="logo-text">
            <h1>WINTER ARC</h1>
            <span className="sub-logo">OCT 1 → DEC 31 • HABIT TRACKER</span>
          </div>
        </div>
        <div className="winter-arc-tag">
          <span className="pulse-dot"></span>
          <span>{arcStarted ? (arcEnded ? `COMPLETED • ${totalArcDays} DAYS` : `LOCKED IN • DAY ${arcDay} / ${totalArcDays}`) : 'STARTS OCT 1'}</span>
        </div>
      </div>

      {/* Month & Year Navigator */}
      <div className="header-center">
        <div className="month-navigator">
          <button 
            onClick={handlePrevMonth} 
            className="nav-btn" 
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="current-month-display">
            <CalendarDays size={16} className="text-muted" />
            <span className="month-text">{MONTH_NAMES[selectedMonth]}</span>
            <span className="year-text">{selectedYear}</span>
          </div>
          <button 
            onClick={handleNextMonth} 
            className="nav-btn" 
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight size={18} />
          </button>
          <button onClick={handleToday} className="today-pill-btn">
            Today
          </button>
        </div>
      </div>

      {/* Actions & Theme Settings */}
      <div className="header-right">
        {/* Sound Toggle */}
        <button 
          onClick={toggleSound} 
          className="icon-btn" 
          title={soundEnabled ? "Sound enabled (click to mute)" : "Sound muted (click to enable)"}
        >
          {soundEnabled ? <Bell size={16} className="text-primary" /> : <BellOff size={16} />}
        </button>

        {/* Theme Menu Dropdown */}
        <div className="theme-selector-dropdown">
          <button 
            className="icon-btn theme-btn" 
            onClick={() => setShowThemeMenu(prev => !prev)}
            title="Switch Theme"
          >
            <Palette size={16} />
            <span className="theme-btn-label">{currentThemeObj.name}</span>
          </button>

          {showThemeMenu && (
            <div className="theme-menu show" onMouseLeave={() => setShowThemeMenu(false)}>
              <div className="theme-menu-header">Select UI Theme</div>
              {themes.map(t => (
                <button
                  key={t.id}
                  className={`theme-opt ${theme === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setTheme(t.id);
                    setShowThemeMenu(false);
                  }}
                >
                  <span className="theme-opt-icon">
                    <HabitIcon name={t.icon} size={16} />
                  </span>
                  <div className="theme-opt-text">
                    <span className="theme-opt-title">{t.name}</span>
                    <span className="theme-opt-desc">{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export CSV */}
        <button 
          onClick={onExportCsv} 
          className="action-btn secondary-btn" 
          title="Export CSV for Google Sheets / Excel"
        >
          <Download size={15} />
          <span>CSV Export</span>
        </button>

        {/* Add Habit */}
        <button 
          onClick={onOpenAddModal} 
          className="action-btn primary-btn"
        >
          <Plus size={16} />
          <span>Add Habit</span>
        </button>
      </div>
    </header>
  );
}
