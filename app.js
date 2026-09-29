/**
 * Winter Arc Habit Tracker Application Logic
 * Comprehensive state management, calendar calculations, local storage persistence,
 * audio chime effects, confetti celebrations, CSV export, and live dashboard metrics.
 */

class HabitTrackerApp {
  constructor() {
    this.currentDate = new Date();
    this.selectedYear = this.currentDate.getFullYear();
    this.selectedMonth = this.currentDate.getMonth(); // 0-11 (e.g. 9 for October)
    this.habits = [];
    this.checkData = {}; // { habitId: { dayNumber: boolean } }
    this.dailyMetrics = { steps: 8000, water: 3.0, deepWork: 4.0, notes: {} };
    this.activeCategoryFilter = 'ALL';
    this.searchQuery = '';
    this.soundEnabled = true;
    this.quoteIndex = 0;

    this.monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    this.dayShortNames = ["S", "M", "T", "W", "T", "F", "S"]; // Sunday=0, Monday=1, ...

    this.init();
  }

  init() {
    this.loadSettings();
    this.loadHabits();
    this.loadMonthCheckData();
    this.loadDailyMetrics();
    this.setupEventListeners();
    this.render();
    this.displayQuote();
    this.initAudioContext();
  }

  /* ==========================================================================
     Storage & State Management
     ========================================================================== */
  loadSettings() {
    const savedTheme = localStorage.getItem('winter_arc_theme') || 'theme-pastel';
    this.setTheme(savedTheme);

    const savedSound = localStorage.getItem('winter_arc_sound');
    this.soundEnabled = savedSound !== null ? JSON.parse(savedSound) : true;
    this.updateSoundButtonUI();
  }

  loadHabits() {
    const saved = localStorage.getItem('winter_arc_habits_list');
    if (saved) {
      try {
        this.habits = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse habits", e);
        this.habits = [...DEFAULT_WINTER_ARC_HABITS];
      }
    } else {
      // First time launch: use the default 11 Winter Arc habits from user's notebook
      this.habits = JSON.parse(JSON.stringify(DEFAULT_WINTER_ARC_HABITS));
      this.saveHabits();
      this.seedInitialSampleData();
    }
  }

  saveHabits() {
    localStorage.setItem('winter_arc_habits_list', JSON.stringify(this.habits));
  }

  getStorageKeyForMonth() {
    return `winter_arc_checks_${this.selectedYear}_${this.selectedMonth}`;
  }

  loadMonthCheckData() {
    const key = this.getStorageKeyForMonth();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        this.checkData = JSON.parse(saved);
      } catch (e) {
        this.checkData = {};
      }
    } else {
      this.checkData = {};
    }
  }

  saveMonthCheckData() {
    const key = this.getStorageKeyForMonth();
    localStorage.setItem(key, JSON.stringify(this.checkData));
  }

  loadDailyMetrics() {
    const saved = localStorage.getItem(`winter_arc_metrics_${this.selectedYear}_${this.selectedMonth}`);
    if (saved) {
      try {
        this.dailyMetrics = JSON.parse(saved);
      } catch (e) {
        this.dailyMetrics = { steps: 8000, water: 3.0, deepWork: 4.0, notes: {} };
      }
    } else {
      this.dailyMetrics = { steps: 8000, water: 3.0, deepWork: 4.0, notes: {} };
    }
    this.updateDailyMetricsUI();
  }

  saveDailyMetrics() {
    localStorage.setItem(`winter_arc_metrics_${this.selectedYear}_${this.selectedMonth}`, JSON.stringify(this.dailyMetrics));
  }

  /**
   * Seed realistic sample checkmarks matching the screenshots
   */
  seedInitialSampleData() {
    const key = this.getStorageKeyForMonth();
    const sampleChecks = {};
    
    // Seed checkmarks for days 1 to 12
    this.habits.forEach((habit, idx) => {
      sampleChecks[habit.id] = {};
      for (let day = 1; day <= 12; day++) {
        // High consistency for core habits, realistic distribution
        const isChecked = Math.random() > 0.35 || (day <= 3) || (idx === 0 && day <= 10);
        if (isChecked) {
          sampleChecks[habit.id][day] = true;
        }
      }
    });

    this.checkData = sampleChecks;
    this.saveMonthCheckData();
  }

  /* ==========================================================================
     Calendar & Date Computations
     ========================================================================== */
  getDaysInCurrentMonth() {
    return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
  }

  getDayOfWeek(day) {
    // 0 = Sun, 1 = Mon, ..., 6 = Sat
    return new Date(this.selectedYear, this.selectedMonth, day).getDay();
  }

  isCurrentMonth() {
    return (
      this.selectedYear === this.currentDate.getFullYear() &&
      this.selectedMonth === this.currentDate.getMonth()
    );
  }

  getTodayDayNumber() {
    if (this.isCurrentMonth()) {
      return this.currentDate.getDate();
    }
    return null;
  }

  getDaysForWeeks() {
    const totalDays = this.getDaysInCurrentMonth();
    return {
      week1: { start: 1, end: Math.min(7, totalDays) },
      week2: { start: 8, end: Math.min(14, totalDays) },
      week3: { start: 15, end: Math.min(21, totalDays) },
      week4: { start: 22, end: Math.min(28, totalDays) },
      week5: { start: 29, end: totalDays }
    };
  }

  /* ==========================================================================
     Calculations & Metrics
     ========================================================================== */
  calculateStatistics() {
    const daysInMonth = this.getDaysInCurrentMonth();
    let totalCompleted = 0;
    let totalGoal = 0;
    const dailyCounts = {}; // { day: count }
    const habitCompletedCounts = {}; // { habitId: count }
    const categoryStatsMap = {}; // { category: { completed, goal, icon, color } }

    // Initialize daily counts
    for (let d = 1; d <= daysInMonth; d++) {
      dailyCounts[d] = 0;
    }

    // Initialize category stats
    this.habits.forEach(h => {
      habitCompletedCounts[h.id] = 0;
      totalGoal += parseInt(h.goal || 0, 10);

      if (!categoryStatsMap[h.category]) {
        categoryStatsMap[h.category] = {
          name: h.category,
          completed: 0,
          goal: 0,
          icon: h.icon || '📌',
          color: h.color || 'var(--accent-primary)'
        };
      }
      categoryStatsMap[h.category].goal += parseInt(h.goal || 0, 10);
    });

    // Count completions
    this.habits.forEach(h => {
      const habitChecks = this.checkData[h.id] || {};
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

    // Calculate weekly statistics
    const weeks = this.getDaysForWeeks();
    const weeklyStats = [];

    [1, 2, 3, 4, 5].forEach(wNum => {
      const wRange = weeks[`week${wNum}`];
      if (wRange.start <= daysInMonth) {
        const daysInThisWeek = Math.max(0, wRange.end - wRange.start + 1);
        let weekCompleted = 0;
        
        for (let d = wRange.start; d <= wRange.end; d++) {
          weekCompleted += (dailyCounts[d] || 0);
        }

        const maxPossible = this.habits.length * daysInThisWeek;
        const percent = maxPossible > 0 ? Math.min(100, Math.round((weekCompleted / maxPossible) * 100)) : 0;

        weeklyStats.push({
          weekNum: wNum,
          range: `Days ${wRange.start} - ${wRange.end}`,
          completed: weekCompleted,
          totalHabitDays: maxPossible,
          percent: percent,
          daysInWeek: daysInThisWeek
        });
      } else {
        weeklyStats.push({
          weekNum: wNum,
          range: 'N/A',
          completed: 0,
          totalHabitDays: 0,
          percent: 0,
          daysInWeek: 0
        });
      }
    });

    // Calculate streaks for each habit
    const streaks = {};
    const today = this.getTodayDayNumber() || daysInMonth;
    this.habits.forEach(h => {
      let currentStreak = 0;
      const checks = this.checkData[h.id] || {};
      for (let d = today; d >= 1; d--) {
        if (checks[d]) {
          currentStreak++;
        } else if (d < today) {
          break; // Break streak on first missed day before today
        }
      }
      streaks[h.id] = currentStreak;
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
  }

  /* ==========================================================================
     UI Rendering
     ========================================================================== */
  render() {
    this.renderHeader();
    const stats = this.calculateStatistics();
    
    // Update Dashboard Charts
    if (window.chartEngine) {
      window.chartEngine.updateSummaryDonut(stats.totalCompleted, stats.totalGoal);
      window.chartEngine.updateWeeklyDonuts(stats.weeklyStats);
      window.chartEngine.renderDailyBarChart(
        this.getDaysInCurrentMonth(),
        stats.dailyCounts,
        this.habits.length,
        this.getTodayDayNumber()
      );
      window.chartEngine.renderCategoryBars(stats.categoryStats);
    }

    // Render Main Grid Table
    this.renderTable(stats);
  }

  renderHeader() {
    document.getElementById('currentMonthName').textContent = this.monthNames[this.selectedMonth];
    document.getElementById('currentYear').textContent = this.selectedYear;
    
    // Winter Arc Day Count
    const winterArcStart = new Date(2026, 9, 1); // Oct 1, 2026
    const diffTime = Math.abs(this.currentDate - winterArcStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    document.getElementById('arcDayCount').textContent = diffDays;

    // Today Date string
    const todayStr = this.currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('todayDateStr').textContent = `Today: ${todayStr}`;
  }

  renderTable(stats) {
    const daysInMonth = this.getDaysInCurrentMonth();
    const todayDay = this.getTodayDayNumber();
    const thead = document.getElementById('habitTableHead');
    const tbody = document.getElementById('habitTableBody');

    // Filter habits by search and category
    const filteredHabits = this.habits.filter(h => {
      const matchCat = (this.activeCategoryFilter === 'ALL' || h.category === this.activeCategoryFilter);
      const matchSearch = (!this.searchQuery || 
        h.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        h.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return matchCat && matchSearch;
    });

    // 1. Build Multi-Row Table Header matching Image 1 & 3
    let topHeaderHtml = `
      <tr>
        <th rowspan="2" class="th-habit-name">HABITS</th>
        <th rowspan="2" class="th-category">CATEGORY</th>
        <th rowspan="2" class="th-goal">MONTH GOAL</th>
        <th rowspan="2" class="th-progress">PROGRESS</th>
    `;

    // Week Spans
    const weeks = this.getDaysForWeeks();
    [1, 2, 3, 4, 5].forEach(wNum => {
      const wRange = weeks[`week${wNum}`];
      if (wRange.start <= daysInMonth) {
        const colSpan = wRange.end - wRange.start + 1;
        topHeaderHtml += `<th colspan="${colSpan}" class="th-week-group-${wNum}">WEEK ${wNum}</th>`;
      }
    });

    topHeaderHtml += `</tr><tr>`;

    // Day Letters & Numbers Row
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeekIdx = this.getDayOfWeek(day);
      const dayLetter = this.dayShortNames[dayOfWeekIdx];
      const isToday = (day === todayDay);
      
      let weekNum = 1;
      if (day <= 7) weekNum = 1;
      else if (day <= 14) weekNum = 2;
      else if (day <= 21) weekNum = 3;
      else if (day <= 28) weekNum = 4;
      else weekNum = 5;

      topHeaderHtml += `
        <th class="th-day-cell th-week-group-${weekNum} ${isToday ? 'is-today' : ''}" title="Day ${day} (${dayLetter})">
          <div class="th-day-name">${dayLetter}</div>
          <div class="th-day-num">${day}</div>
        </th>
      `;
    }

    topHeaderHtml += `</tr>`;
    thead.innerHTML = topHeaderHtml;

    // 2. Build Table Body Rows
    if (filteredHabits.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${4 + daysInMonth}" style="padding: 30px; color: var(--text-muted);">
            No habits found matching your filter. Click <strong>+ Add Habit</strong> to create one!
          </td>
        </tr>
      `;
      return;
    }

    let tbodyHtml = '';
    filteredHabits.forEach(habit => {
      const completedCount = stats.habitCompletedCounts[habit.id] || 0;
      const goal = parseInt(habit.goal || 20, 10);
      const progressPercent = goal > 0 ? Math.min(100, Math.round((completedCount / goal) * 100)) : 0;
      const streak = stats.streaks[habit.id] || 0;
      const habitChecks = this.checkData[habit.id] || {};

      tbodyHtml += `
        <tr data-habit-id="${habit.id}">
          <!-- Habit Name & Streak -->
          <td class="td-habit-name">
            <div class="habit-title-wrap">
              <div class="habit-name-left">
                <span class="habit-icon">${habit.icon || '⚡'}</span>
                <span>${habit.name}</span>
                ${streak > 0 ? `<span class="habit-streak" title="${streak} day active streak!">🔥 ${streak}</span>` : ''}
              </div>
              <div class="habit-row-actions">
                <button class="row-btn" onclick="app.openEditHabitModal('${habit.id}')" title="Edit habit">✏️</button>
                <button class="row-btn" onclick="app.deleteHabit('${habit.id}')" title="Delete habit">🗑️</button>
              </div>
            </div>
          </td>

          <!-- Category Badge -->
          <td>
            <span class="category-badge">
              <span>${habit.icon || '📌'}</span>
              <span>${habit.category}</span>
            </span>
          </td>

          <!-- Month Goal Input -->
          <td>
            <input type="number" 
                   class="goal-input" 
                   value="${habit.goal}" 
                   min="1" 
                   max="31" 
                   title="Click to edit target goal"
                   onchange="app.updateHabitGoal('${habit.id}', this.value)">
          </td>

          <!-- Progress Bar Cell -->
          <td>
            <div class="progress-cell-box">
              <span class="progress-fraction">${completedCount}/${goal} (${progressPercent}%)</span>
              <div class="mini-progress-bar">
                <div class="mini-progress-fill" style="width: ${progressPercent}%; background-color: ${habit.color || 'var(--accent-primary)'};"></div>
              </div>
            </div>
          </td>
      `;

      // Checkbox Cells for Days 1..31
      for (let day = 1; day <= daysInMonth; day++) {
        const isChecked = !!habitChecks[day];
        const isToday = (day === todayDay);
        
        let weekClass = 'week1-check';
        if (day <= 7) weekClass = 'week1-check';
        else if (day <= 14) weekClass = 'week2-check';
        else if (day <= 21) weekClass = 'week3-check';
        else if (day <= 28) weekClass = 'week4-check';
        else weekClass = 'week5-check';

        tbodyHtml += `
          <td class="habit-checkbox-cell ${isToday ? 'is-today' : ''}" 
              onclick="app.handleCellClick(event, '${habit.id}', ${day})">
            <input type="checkbox" 
                   class="habit-checkbox ${weekClass}" 
                   data-habit="${habit.id}" 
                   data-day="${day}" 
                   ${isChecked ? 'checked' : ''}
                   title="${habit.name} - Day ${day}">
          </td>
        `;
      }

      tbodyHtml += `</tr>`;
    });

    tbody.innerHTML = tbodyHtml;
  }

  /* ==========================================================================
     Interactions & Sound Effects
     ========================================================================== */
  initAudioContext() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    } catch (e) {
      this.audioCtx = null;
    }
  }

  playCheckSound(isChecked) {
    if (!this.soundEnabled || !this.audioCtx) return;
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    if (isChecked) {
      // Pleasant upward chime (E5 -> B5)
      osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(987.77, this.audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.18);
    } else {
      // Subtle downward tick
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    }
  }

  handleCellClick(event, habitId, day) {
    // If target was not the checkbox directly, toggle it
    const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
    if (event.target !== checkbox && checkbox) {
      checkbox.checked = !checkbox.checked;
    }
    
    const isChecked = checkbox ? checkbox.checked : false;
    this.toggleHabitDay(habitId, day, isChecked);
  }

  toggleHabitDay(habitId, day, isChecked) {
    if (!this.checkData[habitId]) {
      this.checkData[habitId] = {};
    }

    if (isChecked) {
      this.checkData[habitId][day] = true;
      this.playCheckSound(true);
      this.checkDailyMilestone(day);
    } else {
      delete this.checkData[habitId][day];
      this.playCheckSound(false);
    }

    this.saveMonthCheckData();
    this.render();
  }

  checkDailyMilestone(day) {
    // Check if user completed all habits for this day
    let completedToday = 0;
    this.habits.forEach(h => {
      if (this.checkData[h.id] && this.checkData[h.id][day]) {
        completedToday++;
      }
    });

    if (completedToday === this.habits.length && this.habits.length > 0) {
      this.triggerConfetti();
      this.showToast(`🔥 100% PERFECT DAY ${day}! Winter Arc Unlocked!`);
    }
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  updateHabitGoal(habitId, newGoal) {
    const parsed = parseInt(newGoal, 10);
    if (isNaN(parsed) || parsed < 1) return;
    
    const habit = this.habits.find(h => h.id === habitId);
    if (habit) {
      habit.goal = Math.min(31, parsed);
      this.saveHabits();
      this.render();
      this.showToast(`Goal updated for ${habit.name}`);
    }
  }

  quickFillToday() {
    const today = this.getTodayDayNumber();
    if (!today) {
      this.showToast("Navigate to current month to check today's habits!");
      return;
    }

    let changed = 0;
    this.habits.forEach(h => {
      if (!this.checkData[h.id]) this.checkData[h.id] = {};
      if (!this.checkData[h.id][today]) {
        this.checkData[h.id][today] = true;
        changed++;
      }
    });

    this.saveMonthCheckData();
    this.render();
    this.triggerConfetti();
    this.playCheckSound(true);
    this.showToast(`Checked all ${this.habits.length} habits for today! 🚀`);
  }

  resetCurrentMonth() {
    if (confirm(`Are you sure you want to reset all habit checkmarks for ${this.monthNames[this.selectedMonth]} ${this.selectedYear}?`)) {
      this.checkData = {};
      this.saveMonthCheckData();
      this.render();
      this.showToast("Month checkmarks reset successfully.");
    }
  }

  scrollTableToDay(day) {
    const cell = document.querySelector(`.habit-checkbox-cell[onclick*="${day}"]`);
    if (cell) {
      cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  /* ==========================================================================
     Daily Reflection & Winter Arc Metrics
     ========================================================================== */
  adjustDailyMetric(metric, delta) {
    if (metric === 'steps') {
      this.dailyMetrics.steps = Math.max(0, (this.dailyMetrics.steps || 8000) + delta);
    } else if (metric === 'water') {
      this.dailyMetrics.water = Math.max(0, Math.round(((this.dailyMetrics.water || 3.0) + delta) * 10) / 10);
    } else if (metric === 'deepWork') {
      this.dailyMetrics.deepWork = Math.max(0, Math.round(((this.dailyMetrics.deepWork || 4.0) + delta) * 10) / 10);
    }
    this.saveDailyMetrics();
    this.updateDailyMetricsUI();
  }

  updateDailyMetricsUI() {
    const stepsEl = document.getElementById('metricSteps');
    const waterEl = document.getElementById('metricWater');
    const deepWorkEl = document.getElementById('metricDeepWork');
    const noteInput = document.getElementById('dailyLogNote');

    if (stepsEl) stepsEl.textContent = (this.dailyMetrics.steps || 8000).toLocaleString();
    if (waterEl) waterEl.textContent = `${(this.dailyMetrics.water || 3.0)} L`;
    if (deepWorkEl) deepWorkEl.textContent = `${(this.dailyMetrics.deepWork || 4.0)} hrs`;

    const todayDay = this.getTodayDayNumber() || 1;
    if (noteInput && this.dailyMetrics.notes && this.dailyMetrics.notes[todayDay]) {
      noteInput.value = this.dailyMetrics.notes[todayDay];
    }
  }

  saveDailyNote() {
    const noteInput = document.getElementById('dailyLogNote');
    if (!noteInput) return;
    
    const todayDay = this.getTodayDayNumber() || 1;
    if (!this.dailyMetrics.notes) this.dailyMetrics.notes = {};
    this.dailyMetrics.notes[todayDay] = noteInput.value.trim();
    this.saveDailyMetrics();
    this.showToast("Daily note saved! 📝");
  }

  displayQuote() {
    const quoteEl = document.getElementById('motivationalQuote');
    const authorEl = document.getElementById('quoteAuthor');
    if (!quoteEl || !authorEl) return;

    const q = MOTIVATIONAL_QUOTES[this.quoteIndex % MOTIVATIONAL_QUOTES.length];
    quoteEl.textContent = q.quote;
    authorEl.textContent = `— ${q.author}`;
  }

  nextQuote() {
    this.quoteIndex++;
    this.displayQuote();
  }

  /* ==========================================================================
     Habit CRUD Operations
     ========================================================================== */
  openAddHabitModal() {
    document.getElementById('modalTitle').textContent = 'Add New Habit';
    document.getElementById('editHabitId').value = '';
    document.getElementById('habitNameInput').value = '';
    document.getElementById('habitCategoryInput').value = 'Tech / Study';
    document.getElementById('habitGoalInput').value = '25';
    document.getElementById('habitIconInput').value = '⚡';
    document.getElementById('habitModalBackdrop').classList.add('show');
  }

  openEditHabitModal(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    document.getElementById('modalTitle').textContent = 'Edit Habit';
    document.getElementById('editHabitId').value = habit.id;
    document.getElementById('habitNameInput').value = habit.name;
    document.getElementById('habitCategoryInput').value = habit.category;
    document.getElementById('habitGoalInput').value = habit.goal;
    document.getElementById('habitIconInput').value = habit.icon || '⚡';
    document.getElementById('habitModalBackdrop').classList.add('show');
  }

  closeHabitModal() {
    document.getElementById('habitModalBackdrop').classList.remove('show');
  }

  saveHabitFromModal(event) {
    event.preventDefault();
    const habitId = document.getElementById('editHabitId').value;
    const name = document.getElementById('habitNameInput').value.trim();
    const category = document.getElementById('habitCategoryInput').value;
    const goal = parseInt(document.getElementById('habitGoalInput').value, 10) || 20;
    const icon = document.getElementById('habitIconInput').value.trim() || '⚡';

    if (!name) return;

    if (habitId) {
      // Edit existing
      const existing = this.habits.find(h => h.id === habitId);
      if (existing) {
        existing.name = name;
        existing.category = category;
        existing.goal = goal;
        existing.icon = icon;
      }
      this.showToast(`Updated "${name}"`);
    } else {
      // Add new
      const newHabit = {
        id: `habit-${Date.now()}`,
        name,
        category,
        goal,
        icon,
        color: '#3b82f6'
      };
      this.habits.push(newHabit);
      this.showToast(`Added new habit "${name}"`);
    }

    this.saveHabits();
    this.closeHabitModal();
    this.render();
  }

  deleteHabit(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      this.habits = this.habits.filter(h => h.id !== habitId);
      if (this.checkData[habitId]) {
        delete this.checkData[habitId];
        this.saveMonthCheckData();
      }
      this.saveHabits();
      this.render();
      this.showToast(`Deleted "${habit.name}"`);
    }
  }

  restoreDefaultHabits() {
    if (confirm("Restore the default Winter Arc habits from your handwritten notebook?")) {
      this.habits = JSON.parse(JSON.stringify(DEFAULT_WINTER_ARC_HABITS));
      this.saveHabits();
      this.seedInitialSampleData();
      this.render();
      this.showToast("Winter Arc habits restored!");
    }
  }

  /* ==========================================================================
     Export & Import
     ========================================================================== */
  exportCsv() {
    const daysInMonth = this.getDaysInCurrentMonth();
    const monthStr = this.monthNames[this.selectedMonth];
    let csvContent = `WINTER ARC HABIT TRACKER - ${monthStr} ${this.selectedYear}\n\n`;

    // Header row
    const headers = ["Habit", "Category", "Month Goal", "Completed", "Progress %"];
    for (let d = 1; d <= daysInMonth; d++) {
      headers.push(`Day ${d}`);
    }
    csvContent += headers.map(h => `"${h}"`).join(",") + "\n";

    // Data rows
    this.habits.forEach(habit => {
      const checks = this.checkData[habit.id] || {};
      let completedCount = 0;
      const dayValues = [];

      for (let d = 1; d <= daysInMonth; d++) {
        if (checks[d]) {
          completedCount++;
          dayValues.push("TRUE");
        } else {
          dayValues.push("FALSE");
        }
      }

      const progress = habit.goal > 0 ? Math.round((completedCount / habit.goal) * 100) : 0;
      const row = [
        habit.name,
        habit.category,
        habit.goal,
        completedCount,
        `${progress}%`,
        ...dayValues
      ];

      csvContent += row.map(cell => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Winter_Arc_${monthStr}_${this.selectedYear}_Tracker.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Exported Google Sheets / Excel CSV file! 📥");
  }

  exportJson() {
    const backupData = {
      version: "1.0",
      habits: this.habits,
      checks: this.checkData,
      metrics: this.dailyMetrics,
      year: this.selectedYear,
      month: this.selectedMonth
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Winter_Arc_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast("Backup JSON exported successfully!");
  }

  importJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.habits && Array.isArray(imported.habits)) {
          this.habits = imported.habits;
          this.saveHabits();
        }
        if (imported.checks) {
          this.checkData = imported.checks;
          this.saveMonthCheckData();
        }
        if (imported.metrics) {
          this.dailyMetrics = imported.metrics;
          this.saveDailyMetrics();
        }
        this.render();
        this.showToast("Backup restored successfully! 🎉");
      } catch (err) {
        alert("Invalid backup file!");
      }
    };
    reader.readAsText(file);
  }

  /* ==========================================================================
     Theme & UI Controls
     ========================================================================== */
  setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('winter_arc_theme', themeName);

    const themeNames = {
      'theme-pastel': 'Pastel Sheet',
      'theme-frost': 'Winter Arc Frost',
      'theme-midnight': 'Midnight Cyber',
      'theme-clean': 'Clean Minimal'
    };

    const labelEl = document.getElementById('currentThemeName');
    if (labelEl) labelEl.textContent = themeNames[themeName] || 'Theme';

    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('winter_arc_sound', JSON.stringify(this.soundEnabled));
    this.updateSoundButtonUI();
    this.showToast(this.soundEnabled ? "Sound enabled 🔔" : "Sound muted 🔕");
  }

  updateSoundButtonUI() {
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
      btn.innerHTML = `<span class="icon">${this.soundEnabled ? '🔔' : '🔕'}</span>`;
    }
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ==========================================================================
     Event Listeners Setup
     ========================================================================== */
  setupEventListeners() {
    // Navigation
    document.getElementById('prevMonthBtn').addEventListener('click', () => {
      this.selectedMonth--;
      if (this.selectedMonth < 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      }
      this.loadMonthCheckData();
      this.loadDailyMetrics();
      this.render();
    });

    document.getElementById('nextMonthBtn').addEventListener('click', () => {
      this.selectedMonth++;
      if (this.selectedMonth > 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      }
      this.loadMonthCheckData();
      this.loadDailyMetrics();
      this.render();
    });

    document.getElementById('todayBtn').addEventListener('click', () => {
      this.selectedYear = this.currentDate.getFullYear();
      this.selectedMonth = this.currentDate.getMonth();
      this.loadMonthCheckData();
      this.loadDailyMetrics();
      this.render();
    });

    // Theme dropdown
    const themeMenuBtn = document.getElementById('themeMenuBtn');
    const themeMenu = document.getElementById('themeMenu');
    themeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => themeMenu.classList.remove('show'));

    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setTheme(btn.dataset.theme);
        themeMenu.classList.remove('show');
      });
    });

    // Sound toggle
    document.getElementById('soundToggleBtn').addEventListener('click', () => this.toggleSound());

    // Filter and search
    document.getElementById('habitSearchInput').addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderTable(this.calculateStatistics());
    });

    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeCategoryFilter = chip.dataset.category;
        this.renderTable(this.calculateStatistics());
      });
    });

    // Actions
    document.getElementById('quickFillTodayBtn').addEventListener('click', () => this.quickFillToday());
    document.getElementById('resetMonthDataBtn').addEventListener('click', () => this.resetCurrentMonth());
    document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportCsv());
    document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportJson());
    document.getElementById('importJsonInput').addEventListener('change', (e) => this.importJson(e));
    document.getElementById('loadDefaultsBtn').addEventListener('click', () => this.restoreDefaultHabits());
    document.getElementById('saveDailyNoteBtn').addEventListener('click', () => this.saveDailyNote());
    document.getElementById('newQuoteBtn').addEventListener('click', () => this.nextQuote());

    // Modal
    document.getElementById('openAddHabitModalBtn').addEventListener('click', () => this.openAddHabitModal());
    document.getElementById('closeHabitModalBtn').addEventListener('click', () => this.closeHabitModal());
    document.getElementById('cancelModalBtn').addEventListener('click', () => this.closeHabitModal());
    document.getElementById('habitForm').addEventListener('submit', (e) => this.saveHabitFromModal(e));
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HabitTrackerApp();
});
