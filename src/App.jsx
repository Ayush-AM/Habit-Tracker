import React, { useState, useCallback } from 'react';
import { useHabits } from './hooks/useHabits';
import { useAudio } from './hooks/useAudio';
import { useTheme } from './hooks/useTheme';
import { triggerCelebration } from './components/Common/Confetti';
import { ToastContainer } from './components/Common/Toast';
import { Header } from './components/Header';
import { SummaryCard } from './components/Dashboard/SummaryCard';
import { WeeklyDonuts } from './components/Dashboard/WeeklyDonuts';
import { DailyBarChart } from './components/Dashboard/DailyBarChart';
import { CategoryProgress } from './components/Dashboard/CategoryProgress';
import { TableToolbar } from './components/HabitGrid/TableToolbar';
import { HabitTable } from './components/HabitGrid/HabitTable';
import { MobileDailyView } from './components/DailyTracker/MobileDailyView';
import { WinterArcLog } from './components/DailyTracker/WinterArcLog';
import { QuoteCard } from './components/DailyTracker/QuoteCard';
import { HabitModal } from './components/Modals/HabitModal';
import { RotateCcw, Download, Upload, Cloud } from 'lucide-react';

export function App() {
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    daysInMonth,
    todayDayNumber,
    isCurrentMonth,
    habits,
    checkData,
    dailyMetrics,
    persistDailyMetrics,
    stats,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    toggleHabitDay,
    updateHabitGoal,
    addHabit,
    editHabit,
    deleteHabit,
    quickFillToday,
    resetCurrentMonth,
    restoreDefaults,
    exportCsv,
    exportJson,
    importJson,
    // Seamless Auto-Sync
    syncStatus,
    lastSynced,
    syncNow
  } = useHabits();

  const { soundEnabled, toggleSound, playCheckSound } = useAudio();
  const { theme, setTheme, currentThemeObj, themes } = useTheme();

  // View Mode: 'grid' (Matrix Spreadsheet) or 'daily' (Mobile Daily Focus)
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('winter_arc_view_mode');
      if (saved) return saved;
      return window.innerWidth <= 768 ? 'daily' : 'grid';
    }
    return 'grid';
  });

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('winter_arc_view_mode', mode);
    } catch (e) {
      // ignore
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  // Checkbox Click with Sound, Milestone & Auto-Sync
  const handleToggleDay = (habitId, day) => {
    const isNowChecked = toggleHabitDay(habitId, day);
    playCheckSound(isNowChecked);

    if (isNowChecked) {
      let totalCompletedOnDay = 0;
      habits.forEach(h => {
        const isHChecked = (h.id === habitId) ? true : !!(checkData[h.id] && checkData[h.id][day]);
        if (isHChecked) totalCompletedOnDay++;
      });

      if (totalCompletedOnDay === habits.length && habits.length > 0) {
        triggerCelebration();
        addToast(`100% Perfect Day ${day}! Winter Arc discipline locked in.`);
      }
    }
  };

  const handleOpenAddModal = () => {
    setHabitToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit) => {
    setHabitToEdit(habit);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data) => {
    if (habitToEdit) {
      editHabit(habitToEdit.id, data);
      addToast(`Updated habit "${data.name}" (Auto-synced).`);
    } else {
      addHabit(data);
      addToast(`Added new habit "${data.name}" (Auto-synced).`);
    }
  };

  const handleDeleteHabit = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    if (window.confirm(`Delete habit "${habit.name}"?`)) {
      deleteHabit(habitId);
      addToast(`Deleted "${habit.name}" (Auto-synced).`);
      return true;
    }
    return false;
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("Reset habits back to the 12 default Winter Arc habits from your notebook?")) {
      restoreDefaults();
      addToast("Winter Arc notebook habits restored & auto-synced.");
    }
  };

  const handleSyncClick = async () => {
    addToast("Checking cloud synchronization...");
    await syncNow();
    addToast("Cloud synchronized! Changes match localhost & Vercel.");
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />

      {/* Header with Live Auto-Sync Status */}
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        theme={theme}
        setTheme={setTheme}
        currentThemeObj={currentThemeObj}
        themes={themes}
        onExportCsv={exportCsv}
        onOpenAddModal={handleOpenAddModal}
        syncStatus={syncStatus}
        lastSynced={lastSynced}
        onSyncNow={handleSyncClick}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Analytics Dashboard */}
        <section className="dashboard-section">
          <SummaryCard
            completed={stats.totalCompleted}
            goal={stats.totalGoal}
          />
          <WeeklyDonuts weeklyStats={stats.weeklyStats} />
        </section>

        {/* Second Row Charts: Daily Bar Chart & Category Progress */}
        <section className="charts-row-section">
          <DailyBarChart
            daysInMonth={daysInMonth}
            dailyCounts={stats.dailyCounts}
            maxHabitCount={habits.length}
            todayDay={todayDayNumber}
          />
          <CategoryProgress categoryStats={stats.categoryStats} />
        </section>

        {/* Search & Filter Toolbar with View Mode Toggle */}
        <TableToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          viewMode={viewMode}
          setViewMode={handleSetViewMode}
        />

        {/* View Mode Switching: Spreadsheet Matrix or Mobile Daily Focus */}
        {viewMode === 'daily' ? (
          <MobileDailyView
            habits={habits}
            checkData={checkData}
            todayDayNumber={todayDayNumber}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            stats={stats}
            onToggleDay={handleToggleDay}
            onOpenAddModal={handleOpenAddModal}
            onEditHabit={handleOpenEditModal}
            onDeleteHabit={handleDeleteHabit}
          />
        ) : (
          <HabitTable
            habits={habits}
            checkData={checkData}
            daysInMonth={daysInMonth}
            todayDayNumber={todayDayNumber}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            stats={stats}
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            onToggleDay={handleToggleDay}
            onUpdateGoal={updateHabitGoal}
            onEditHabit={handleOpenEditModal}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {/* Daily Reflection & Winter Arc Timelog */}
        <section className="bottom-extra-section">
          <WinterArcLog
            dailyMetrics={dailyMetrics}
            persistDailyMetrics={persistDailyMetrics}
            todayDayNumber={todayDayNumber}
            onNotify={addToast}
          />
          <QuoteCard />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <Cloud size={14} className="text-emerald-500" />
          <span>Winter Arc • Live Auto-Synchronized • Localhost & Vercel</span>
        </div>
        <div className="footer-right">
          <button onClick={handleRestoreDefaults} className="footer-link-btn">
            <RotateCcw size={12} />
            <span>Restore Notebook Habits</span>
          </button>
          <button onClick={exportJson} className="footer-link-btn">
            <Download size={12} />
            <span>Backup JSON</span>
          </button>
          <label className="footer-link-btn file-import-label">
            <Upload size={12} />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => importJson(e.target.files[0], () => addToast("Backup restored & auto-synced."))}
            />
          </label>
        </div>
      </footer>

      {/* Habit Add/Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitToEdit={habitToEdit}
        onSave={handleSaveModal}
        onDelete={handleDeleteHabit}
      />
    </div>
  );
}

export default App;
