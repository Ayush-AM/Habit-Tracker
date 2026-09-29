import { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_WINTER_ARC_HABITS, MONTH_NAMES } from '../types/habit';

export function useHabits() {
  const [currentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(2026);
  // Default to October if we're before the arc start
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const month = now.getMonth();
    // If we're in Sep 2026 or earlier, show October (arc start)
    if (now.getFullYear() === 2026 && month < 9) return 9;
    return month;
  });
  
  // Habits list
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('winter_arc_habits_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [...DEFAULT_WINTER_ARC_HABITS];
      }
    }
    return [...DEFAULT_WINTER_ARC_HABITS];
  });

  // Checkmarks dictionary: { [habitId]: { [day]: boolean } }
  // Starts completely empty — no sample data. User begins fresh from Oct 1.
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

  // Sync habits to localStorage
  useEffect(() => {
    localStorage.setItem('winter_arc_habits_list', JSON.stringify(habits));
  }, [habits]);

  // Load checkData when month/year changes
  useEffect(() => {
    const key = `winter_arc_checks_${selectedYear}_${selectedMonth}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCheckData(JSON.parse(saved));
      } catch (e) {
        setCheckData({});
      }
    } else {
      setCheckData({});
    }

    const metricsKey = `winter_arc_metrics_${selectedYear}_${selectedMonth}`;
    const savedMetrics = localStorage.getItem(metricsKey);
    if (savedMetrics) {
      try {
        setDailyMetrics(JSON.parse(savedMetrics));
      } catch (e) {
        setDailyMetrics({ steps: 8000, water: 3.0, deepWork: 4.0, notes: {} });
      }
    } else {
      setDailyMetrics({ steps: 8000, water: 3.0, deepWork: 4.0, notes: {} });
    }
  }, [selectedYear, selectedMonth]);

  // Save checkData
  const persistCheckData = useCallback((newData) => {
    setCheckData(newData);
    const key = `winter_arc_checks_${selectedYear}_${selectedMonth}`;
    localStorage.setItem(key, JSON.stringify(newData));
  }, [selectedYear, selectedMonth]);

  // Save daily metrics
  const persistDailyMetrics = useCallback((newMetrics) => {
    setDailyMetrics(newMetrics);
    const key = `winter_arc_metrics_${selectedYear}_${selectedMonth}`;
    localStorage.setItem(key, JSON.stringify(newMetrics));
  }, [selectedYear, selectedMonth]);

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
          icon: h.icon || '📌',
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
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, goal: Math.min(31, parsed) } : h));
  }, []);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      ...habit,
      id: `habit-${Date.now()}`,
      color: habit.color || '#3b82f6'
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const editHabit = useCallback((habitId, updatedFields) => {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, ...updatedFields } : h));
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    const updated = { ...checkData };
    if (updated[habitId]) {
      delete updated[habitId];
      persistCheckData(updated);
    }
  }, [checkData, persistCheckData]);

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
    setHabits(JSON.parse(JSON.stringify(DEFAULT_WINTER_ARC_HABITS)));
    // Clean slate — no sample data
    persistCheckData({});
  }, [persistCheckData]);

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
      version: "2.0-react",
      habits,
      checks: checkData,
      metrics: dailyMetrics,
      year: selectedYear,
      month: selectedMonth
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

  const importJson = useCallback((file, onSuccess, onError) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.habits && Array.isArray(imported.habits)) {
          setHabits(imported.habits);
        }
        if (imported.checks) {
          persistCheckData(imported.checks);
        }
        if (imported.metrics) {
          persistDailyMetrics(imported.metrics);
        }
        if (onSuccess) onSuccess();
      } catch (err) {
        if (onError) onError(err);
      }
    };
    reader.readAsText(file);
  }, [persistCheckData, persistDailyMetrics]);

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
    importJson
  };
}
