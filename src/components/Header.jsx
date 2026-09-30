import { useState } from 'react';
import { 
  Snowflake, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  BellOff, 
  Palette, 
  Download, 
  Plus, 
  CalendarDays,
  Cloud,
  RefreshCw,
  Check,
  X
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
  onOpenAddModal,
  syncStatus,
  lastSynced,
  onSyncNow
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

  // Calculate day count from the start of the current year
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const diffMs = now - yearStart;
  const dayOfYear = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const totalDaysInYear = ((now.getFullYear() % 4 === 0) ? 366 : 365);

  return (
    <header className="app-header">
      {/* Brand & Streak Badge */}
      <div className="header-left">
        <div className="logo-badge">
          <div className="logo-icon-wrap">
            <Snowflake className="logo-snowflake" size={24} />
          </div>
          <div className="logo-text">
            <div className="logo-title-row">
              <h1>HABIT TRACKER</h1>
            </div>
            <span className="sub-logo">DAILY DISCIPLINE & ANALYTICS</span>
          </div>
        </div>
        <div className="winter-arc-tag">
          <span className="pulse-dot"></span>
          <span>DAY {dayOfYear} / {totalDaysInYear}</span>
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

      {/* Actions & Auto-Sync Status */}
      <div className="header-right">
        {/* Live Auto-Sync Status Pill */}
        <button
          onClick={onSyncNow}
          className="auto-sync-status-pill"
          title="Auto-sync active: changes reflect between localhost and Vercel automatically. Click to force sync."
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCw size={13} className="spin text-blue-500" />
              <span className="sync-pill-text">Syncing</span>
            </>
          ) : syncStatus === 'offline' ? (
            <>
              <Cloud size={13} className="text-muted" />
              <span className="sync-pill-text">Offline</span>
            </>
          ) : (
            <>
              <span className="sync-pulse-dot"></span>
              <Cloud size={13} className="text-emerald-500" />
              <span className="sync-pill-text">Synced</span>
            </>
          )}
        </button>

        {/* Sound Toggle */}
        <button 
          onClick={toggleSound} 
          className="icon-btn header-sound-btn" 
          title={soundEnabled ? "Sound enabled (click to mute)" : "Sound muted (click to enable)"}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Bell size={16} className="text-primary" /> : <BellOff size={16} />}
        </button>

        {/* Theme Menu Dropdown with Backdrop for Touch Devices */}
        <div className="theme-selector-dropdown">
          <button 
            className="icon-btn theme-btn" 
            onClick={() => setShowThemeMenu(prev => !prev)}
            title="Switch UI Theme"
            aria-label="Switch UI Theme"
          >
            <Palette size={16} />
            <span className="theme-btn-label">{currentThemeObj.name}</span>
          </button>

          {showThemeMenu && (
            <>
              <div 
                className="theme-menu-backdrop" 
                onClick={() => setShowThemeMenu(false)}
              />
              <div className="theme-menu show">
                <div className="theme-sheet-handle" />
                <div className="theme-menu-header">
                  <span>Select UI Theme</span>
                  <button 
                    onClick={() => setShowThemeMenu(false)} 
                    className="theme-close-btn"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="theme-opts-list">
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
                        <HabitIcon name={t.icon} size={18} />
                      </span>
                      <div className="theme-opt-text">
                        <span className="theme-opt-title">{t.name}</span>
                        <span className="theme-opt-desc">{t.desc}</span>
                        {t.colors && (
                          <div className="theme-opt-swatches">
                            {t.colors.map((c, i) => (
                              <span 
                                key={i} 
                                className="theme-opt-swatch" 
                                style={{ backgroundColor: c }} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {theme === t.id && (
                        <Check size={18} className="theme-active-check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export CSV */}
        <button 
          onClick={onExportCsv} 
          className="action-btn secondary-btn header-csv-btn" 
          title="Export CSV for Google Sheets / Excel"
        >
          <Download size={15} />
          <span>CSV</span>
        </button>

        {/* Add Habit */}
        <button 
          onClick={onOpenAddModal} 
          className="action-btn primary-btn header-add-btn"
          title="Add a new habit"
        >
          <Plus size={16} />
          <span>New Habit</span>
        </button>
      </div>
    </header>
  );
}
