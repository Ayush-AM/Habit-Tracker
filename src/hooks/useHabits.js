import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DEFAULT_WINTER_ARC_HABITS, MONTH_NAMES } from '../types/habit';
import { 
  fetchCloudData,
  fetchAllCloudData,
  saveCloudData, 
  subscribeToCloudChanges 
} from '../lib/syncService';

export function useHabits() {
  const [currentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(2026);
  // Default to October if we're before the arc start
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const month = now.getMonth();
    if (now.getFullYear() === 2026 && month < 9) return 9;
    return month;
  });

  // Cloud sync status: 'synced' | 'syncing' | 'offline'
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSynced, setLastSynced] = useState(new Date());

  // Prevent local optimistic writes from echoing back and creating flicker
  const isSyncingFromCloudRef = useRef(false);
  const lastLocalWriteTimeRef = useRef(0);

  // Month check and metric keys
  const checksKey = `winter_arc_checks_${selectedYear}_${selectedMonth}`;
  const metricsKey = `winter_arc_metrics_${selectedYear}_${selectedMonth}`;

  // Legacy emoji migration map
  const emojiToProIcon = {
    '💻': 'Database',
    '⚡': 'Binary',
    '🧠': 'Cpu',
    '🎯': 'Target',
    '🛡️': 'Shield',
    '🛡': 'Shield',
    '📹': 'Video',
    '💪': 'Dumbbell',
    '🗣️': 'Languages',
    '🗣': 'Languages',
    '🎬': 'Clapperboard',
    '👟': 'Footprints',
    '💧': 'Droplets',
    '🌐': 'GitPullRequest',
    '💼': 'Briefcase',
    '🧗': 'Zap',
    '💤': 'Moon',
    '✨': 'Sparkles',
    '📌': 'Target'
  };

  // Habits list (Instant load from localStorage, then hydrate from cloud)
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('winter_arc_habits_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(h => ({
            ...h,
            icon: emojiToProIcon[h.icon] || h.icon || 'Database'
          }));
        }
      } catch (e) {
        return [...DEFAULT_WINTER_ARC_HABITS];
      }
    }
    return [...DEFAULT_WINTER_ARC_HABITS];
  });

  // Checkmarks dictionary: { [habitId]: { [day]: boolean } }
  const [checkData, setCheckData] = useState(() => {
    const key = `winter_arc_checks_${new Date().getFullYear()}_${new Date().getMonth()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Daily extra metrics: steps, water, deep work, notes
  const [dailyMetrics, setDailyMetrics] = useState(() => {
    const key = `winter_arc_metrics_${new Date().getFullYear()}_${new Date().getMonth()}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { steps: 8000, water: 3.0, deepWork: 4.0, notes: {} };
      }
    }
    return { steps: 8000, water: 3.0, deepWork: 4.0, notes: {} };
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Core Cloud Sync Fetcher
  const syncFromCloud = useCallback(async () => {
    // If user made a local change in the last 1.2s, don't overwrite with older read
    if (Date.now() - lastLocalWriteTimeRef.current < 1200) return;

    try {
      setSyncStatus('syncing');
      const allCloud = await fetchAllCloudData();

      // Sync habits
      if (allCloud.habits && Array.isArray(allCloud.habits.data) && allCloud.habits.data.length > 0) {
        const cloudHabitsStr = JSON.stringify(allCloud.habits.data);
        const localHabitsStr = localStorage.getItem('winter_arc_habits_list');
        if (cloudHabitsStr !== localHabitsStr) {
          isSyncingFromCloudRef.current = true;
          setHabits(allCloud.habits.data);
          localStorage.setItem('winter_arc_habits_list', cloudHabitsStr);
          setTimeout(() => { isSyncingFromCloudRef.current = false; }, 100);
        }
      } else if (habits && habits.length > 0) {
        // Initial seed to cloud
        saveCloudData('habits', habits);
      }

      // Sync monthly checks
      if (allCloud[checksKey] && typeof allCloud[checksKey].data === 'object') {
        const cloudChecksStr = JSON.stringify(allCloud[checksKey].data);
        const localChecksStr = localStorage.getItem(checksKey);
        if (cloudChecksStr !== localChecksStr) {
          isSyncingFromCloudRef.current = true;
          setCheckData(allCloud[checksKey].data);
          localStorage.setItem(checksKey, cloudChecksStr);
          setTimeout(() => { isSyncingFromCloudRef.current = false; }, 100);
        }
      }

      // Sync monthly metrics
      if (allCloud[metricsKey] && typeof allCloud[metricsKey].data === 'object') {
        const cloudMetricsStr = JSON.stringify(allCloud[metricsKey].data);
        const localMetricsStr = localStorage.getItem(metricsKey);
        if (cloudMetricsStr !== localMetricsStr) {
          isSyncingFromCloudRef.current = true;
          setDailyMetrics(allCloud[metricsKey].data);
          localStorage.setItem(metricsKey, cloudMetricsStr);
          setTimeout(() => { isSyncingFromCloudRef.current = false; }, 100);
        }
      }

      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (err) {
      console.warn('[AutoSync] Error during syncFromCloud:', err);
      setSyncStatus('offline');
    }
  }, [checksKey, metricsKey, habits]);

  // 1. Initial Cloud Sync on Mount & Month Switch
  useEffect(() => {
    // First load from localStorage for instant display
    const savedChecks = localStorage.getItem(checksKey);
    if (savedChecks) {
      try { setCheckData(JSON.parse(savedChecks)); } catch (e) {}
    } else {
      setCheckData({});
    }

    const savedMetrics = localStorage.getItem(metricsKey);
    if (savedMetrics) {
      try { setDailyMetrics(JSON.parse(savedMetrics)); } catch (e) {}
    } else {
      setDailyMetrics({ steps: 8000, water: 3.0, deepWork: 4.0, notes: {} });
    }

    // Then pull live from cloud
    syncFromCloud();
  }, [selectedYear, selectedMonth, syncFromCloud, checksKey, metricsKey]);

  // 2. Real-time Subscription (Live two-way sync across localhost & Vercel)
  useEffect(() => {
    const unsubscribe = subscribeToCloudChanges(({ key, data }) => {
      // If we just wrote locally, ignore the immediate echo
      if (Date.now() - lastLocalWriteTimeRef.current < 1200) return;

      if (key === 'habits' && Array.isArray(data)) {
        isSyncingFromCloudRef.current = true;
        setHabits(data);
        localStorage.setItem('winter_arc_habits_list', JSON.stringify(data));
        setSyncStatus('synced');
        setLastSynced(new Date());
        setTimeout(() => { isSyncingFromCloudRef.current = false; }, 100);
      } else if (key === checksKey && data) {
        isSyncingFromCloudRef.current = true;
        setCheckData(data);
        localStorage.setItem(checksKey, JSON.stringify(data));
        setSyncStatus('synced');
        setLastSynced(new Date());
        setTimeout(() => { isSyncingFromCloudRef.current = false; }, 100);
      } else if (key === metricsKey && data) {
        isSyncingFromCloudRef.current = true;
        setDailyMetrics(data);
        localStorage.setItem(metricsKey, JSON.stringify(data));
        setSyncStatus('synced');
        setLastSynced(new Date());
        setTimeout(() => { isSyncingFromCloudRef.current = false; }, 100);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [checksKey, metricsKey]);

  // 3. Tab Visibility, Focus & Periodic Auto-Sync (Every 5 seconds)
  useEffect(() => {
    const handleFocus = () => {
      syncFromCloud();
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromCloud();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Periodic 5-second sync to guarantee freshness across devices
    const interval = setInterval(syncFromCloud, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [syncFromCloud]);

  // Persist checkData (Local + Supabase Cloud)
  const persistCheckData = useCallback(async (newData) => {
    lastLocalWriteTimeRef.current = Date.now();
    setCheckData(newData);
    localStorage.setItem(checksKey, JSON.stringify(newData));

    setSyncStatus('syncing');
    const success = await saveCloudData(checksKey, newData);
    if (success) {
      setSyncStatus('synced');
      setLastSynced(new Date());
    } else {
      setSyncStatus('offline');
    }
  }, [checksKey]);

  // Persist habits (Local + Supabase Cloud)
  const persistHabits = useCallback(async (newHabits) => {
    lastLocalWriteTimeRef.current = Date.now();
    setHabits(newHabits);
    localStorage.setItem('winter_arc_habits_list', JSON.stringify(newHabits));

    setSyncStatus('syncing');
    const success = await saveCloudData('habits', newHabits);
    if (success) {
      setSyncStatus('synced');
      setLastSynced(new Date());
    } else {
      setSyncStatus('offline');
    }
  }, []);

  // Persist daily metrics (Local + Supabase Cloud)
  const persistDailyMetrics = useCallback(async (newMetrics) => {
    lastLocalWriteTimeRef.current = Date.now();
    setDailyMetrics(newMetrics);
    localStorage.setItem(metricsKey, JSON.stringify(newMetrics));

    setSyncStatus('syncing');
    const success = await saveCloudData(metricsKey, newMetrics);
    if (success) {
      setSyncStatus('synced');
      setLastSynced(new Date());
    } else {
      setSyncStatus('offline');
    }
  }, [metricsKey]);

  // Calendar info
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const isCurrentMonth = useMemo(() => {
    return (
      selectedYear === currentDate.getFullYear() &&
      selectedMonth === currentDate.getMonth()
    );
  }, [selectedYear, selectedMonth, currentDate]);

  const todayDayNumber = useMemo(() => {
    return isCurrentMonth ? currentDate.getDate() : null;
  }, [isCurrentMonth, currentDate]);

  // Week ranges
  const weekRanges = useMemo(() => {
    return {
      week1: { start: 1, end: Math.min(7, daysInMonth) },
      week2: { start: 8, end: Math.min(14, daysInMonth) },
      week3: { start: 15, end: Math.min(21, daysInMonth) },
      week4: { start: 22, end: Math.min(28, daysInMonth) },
      week5: { start: 29, end: daysInMonth }
    };
  }, [daysInMonth]);

  // Statistics Calculation
  const stats = useMemo(() => {
    let totalCompleted = 0;
    let totalGoal = 0;
    const dailyCounts = {};
    const habitCompletedCounts = {};
    const categoryStatsMap = {};

    for (let d = 1; d <= daysInMonth; d++) {
      dailyCounts[d] = 0;
    }

    habits.forEach(h => {
      habitCompletedCounts[h.id] = 0;
      totalGoal += parseInt(h.goal || 0, 10);

      if (!categoryStatsMap[h.category]) {
        categoryStatsMap[h.category] = {
          name: h.category,
          completed: 0,
          goal: 0,
          icon: h.icon || 'Target',
          color: h.color || '#3b82f6'
        };
      }
      categoryStatsMap[h.category].goal += parseInt(h.goal || 0, 10);
    });

    habits.forEach(h => {
      const habitChecks = checkData[h.id] || {};
      for (let d = 1; d <= daysInMonth; d++) {
        if (habitChecks[d]) {
          totalCompleted++;
          dailyCounts[d] = (dailyCounts[d] || 0) + 1;
          habitCompletedCounts[h.id] = (habitCompletedCounts[h.id] || 0) + 1;
          if (categoryStatsMap[h.category]) {
            categoryStatsMap[h.category].completed++;
          }
        }
      }
    });

    // Weekly stats
    const weeklyStats = [1, 2, 3, 4, 5].map(wNum => {
      const wRange = weekRanges[`week${wNum}`];
      if (wRange.start <= daysInMonth) {
        const daysInThisWeek = Math.max(0, wRange.end - wRange.start + 1);
        let weekCompleted = 0;
        for (let d = wRange.start; d <= wRange.end; d++) {
          weekCompleted += (dailyCounts[d] || 0);
        }
        const maxPossible = habits.length * daysInThisWeek;
        const percent = maxPossible > 0 ? Math.min(100, Math.round((weekCompleted / maxPossible) * 100)) : 0;
        return {
          weekNum: wNum,
          range: `Days ${wRange.start} - ${wRange.end}`,
          completed: weekCompleted,
          totalHabitDays: maxPossible,
          percent: percent,
          daysInWeek: daysInThisWeek
        };
      }
      return {
        weekNum: wNum,
        range: 'N/A',
        completed: 0,
        totalHabitDays: 0,
        percent: 0,
        daysInWeek: 0
      };
    });

    // Calculate streaks
    const streaks = {};
    const refDay = todayDayNumber || daysInMonth;
    habits.forEach(h => {
      let streak = 0;
      const checks = checkData[h.id] || {};
      for (let d = refDay; d >= 1; d--) {
        if (checks[d]) {
          streak++;
        } else if (d < refDay) {
          break;
        }
      }
      streaks[h.id] = streak;
    });

    return {
      totalCompleted,
      totalGoal,
      dailyCounts,
      habitCompletedCounts,
      categoryStats: Object.values(categoryStatsMap),
      weeklyStats,
      streaks
    };
  }, [habits, checkData, daysInMonth, weekRanges, todayDayNumber]);

  // Actions
  const toggleHabitDay = useCallback((habitId, day) => {
    const updated = { ...checkData };
    if (!updated[habitId]) {
      updated[habitId] = {};
    }
    const willBeChecked = !updated[habitId][day];
    if (willBeChecked) {
      updated[habitId][day] = true;
    } else {
      delete updated[habitId][day];
    }
    persistCheckData(updated);
    return willBeChecked;
  }, [checkData, persistCheckData]);

  const updateHabitGoal = useCallback((habitId, newGoal) => {
    const parsed = parseInt(newGoal, 10);
    if (isNaN(parsed) || parsed < 1) return;
    const updated = habits.map(h => h.id === habitId ? { ...h, goal: Math.min(31, parsed) } : h);
    persistHabits(updated);
  }, [habits, persistHabits]);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      ...habit,
      id: `habit-${Date.now()}`,
      color: habit.color || '#3b82f6'
    };
    persistHabits([...habits, newHabit]);
  }, [habits, persistHabits]);

  const editHabit = useCallback((habitId, updatedFields) => {
    const updated = habits.map(h => h.id === habitId ? { ...h, ...updatedFields } : h);
    persistHabits(updated);
  }, [habits, persistHabits]);

  const deleteHabit = useCallback((habitId) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    persistHabits(updatedHabits);

    const updatedChecks = { ...checkData };
    if (updatedChecks[habitId]) {
      delete updatedChecks[habitId];
      persistCheckData(updatedChecks);
    }
  }, [habits, checkData, persistHabits, persistCheckData]);

  const quickFillToday = useCallback(() => {
    if (!todayDayNumber) return false;
    const updated = { ...checkData };
    habits.forEach(h => {
      if (!updated[h.id]) updated[h.id] = {};
      updated[h.id][todayDayNumber] = true;
    });
    persistCheckData(updated);
    return true;
  }, [checkData, habits, todayDayNumber, persistCheckData]);

  const resetCurrentMonth = useCallback(() => {
    persistCheckData({});
  }, [persistCheckData]);

  const restoreDefaults = useCallback(() => {
    const defaultList = JSON.parse(JSON.stringify(DEFAULT_WINTER_ARC_HABITS));
    persistHabits(defaultList);
    persistCheckData({});
  }, [persistHabits, persistCheckData]);

  const exportCsv = useCallback(() => {
    const monthStr = MONTH_NAMES[selectedMonth];
    let csv = `WINTER ARC HABIT TRACKER - ${monthStr} ${selectedYear}\n\n`;

    const headers = ["Habit", "Category", "Month Goal", "Completed", "Progress %"];
    for (let d = 1; d <= daysInMonth; d++) {
      headers.push(`Day ${d}`);
    }
    csv += headers.map(h => `"${h}"`).join(",") + "\n";

    habits.forEach(h => {
      const checks = checkData[h.id] || {};
      let completedCount = 0;
      const dayCols = [];

      for (let d = 1; d <= daysInMonth; d++) {
        if (checks[d]) {
          completedCount++;
          dayCols.push("TRUE");
        } else {
          dayCols.push("FALSE");
        }
      }

      const progress = h.goal > 0 ? Math.round((completedCount / h.goal) * 100) : 0;
      const row = [h.name, h.category, h.goal, completedCount, `${progress}%`, ...dayCols];
      csv += row.map(c => `"${c}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Winter_Arc_${monthStr}_${selectedYear}_Habits.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [habits, checkData, daysInMonth, selectedMonth, selectedYear]);

  const exportJson = useCallback(() => {
    const data = {
      version: "2.2-auto-synced",
      user: "Ayush",
      habits,
      checks: checkData,
      metrics: dailyMetrics,
      year: selectedYear,
      month: selectedMonth,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Winter_Arc_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [habits, checkData, dailyMetrics, selectedYear, selectedMonth]);

  const importJson = useCallback(async (file, onSuccess, onError) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.habits && Array.isArray(imported.habits)) {
          await persistHabits(imported.habits);
        }
        if (imported.checks) {
          await persistCheckData(imported.checks);
        }
        if (imported.metrics) {
          await persistDailyMetrics(imported.metrics);
        }
        if (onSuccess) onSuccess();
      } catch (err) {
        if (onError) onError(err);
      }
    };
    reader.readAsText(file);
  }, [persistHabits, persistCheckData, persistDailyMetrics]);

  return {
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
    // Seamless Auto-Sync State
    syncStatus,
    lastSynced,
    syncNow: syncFromCloud
  };
}
