/**
 * Chart Engine & Visualizations
 * Renders SVG Donut Gauges, Daily Habit Count Bar Chart, and Category Progress Bars
 * matching the visual layout of Image 2.
 */

class ChartEngine {
  constructor() {
    this.circumferenceLarge = 2 * Math.PI * 48; // ~301.59
    this.circumferenceMini = 2 * Math.PI * 38;  // ~238.76
  }

  /**
   * Update the Large Month Summary Donut Chart
   */
  updateSummaryDonut(completed, totalGoal) {
    const percent = totalGoal > 0 ? Math.round((completed / totalGoal) * 100) : 0;
    const donutFill = document.getElementById('summaryDonutFill');
    const percentText = document.getElementById('summaryPercentText');
    const completedCount = document.getElementById('summaryCompletedCount');
    const goalCount = document.getElementById('summaryGoalCount');
    const paceStatus = document.getElementById('summaryPaceStatus');

    if (donutFill) {
      const offset = this.circumferenceLarge - (percent / 100) * this.circumferenceLarge;
      donutFill.style.strokeDashoffset = Math.max(0, offset);
    }

    if (percentText) percentText.textContent = `${percent}%`;
    if (completedCount) completedCount.textContent = completed;
    if (goalCount) goalCount.textContent = totalGoal;

    if (paceStatus) {
      if (percent >= 80) {
        paceStatus.innerHTML = `<span>🔥 Exceptional! Winter Arc Elite</span>`;
      } else if (percent >= 50) {
        paceStatus.innerHTML = `<span>⚡ Strong Momentum! Keep Going</span>`;
      } else if (percent > 0) {
        paceStatus.innerHTML = `<span>🚀 Locked In • Consistency is Key</span>`;
      } else {
        paceStatus.innerHTML = `<span>❄️ Ready to Start Your Winter Arc</span>`;
      }
    }
  }

  /**
   * Update the 5 Weekly Progress Donut Cards
   */
  updateWeeklyDonuts(weeklyStats) {
    // weeklyStats is an array: [{ weekNum: 1, range: 'Days 1-7', completed: X, totalHabitDays: Y, percent: Z }, ...]
    weeklyStats.forEach((w) => {
      const fillEl = document.getElementById(`week${w.weekNum}DonutFill`);
      const percentEl = document.getElementById(`week${w.weekNum}Percent`);
      const rangeEl = document.getElementById(`week${w.weekNum}Range`);
      const fractionEl = document.getElementById(`week${w.weekNum}Fraction`);
      const cardEl = document.getElementById(`week${w.weekNum}Card`) || document.querySelector(`.card-week-${w.weekNum}`);

      if (cardEl) {
        cardEl.style.display = w.daysInWeek > 0 ? 'flex' : 'none';
      }

      if (fillEl) {
        const offset = this.circumferenceMini - (w.percent / 100) * this.circumferenceMini;
        fillEl.style.strokeDashoffset = Math.max(0, offset);
      }

      if (percentEl) percentEl.textContent = `${w.percent}%`;
      if (rangeEl) rangeEl.textContent = w.range;
      if (fractionEl) fractionEl.textContent = `${w.completed} / ${w.totalHabitDays} Done`;
    });
  }

  /**
   * Render the Daily Habit Count Bar Graph (Days 1 to 28/30/31)
   * Matches Image 2: Vertical bars with heights proportional to completed habits on each day.
   */
  renderDailyBarChart(daysInMonth, dailyCounts, maxHabitCount, todayDay) {
    const container = document.getElementById('dailyBarsContainer');
    const yAxisContainer = document.getElementById('dailyChartYAxis');
    if (!container || !yAxisContainer) return;

    // Determine max ceiling for Y axis
    const yMax = Math.max(maxHabitCount, 5);
    const step = Math.ceil(yMax / 4);

    // Build Y-axis labels
    let yAxisHtml = '';
    for (let i = step * 4; i >= 0; i -= step) {
      yAxisHtml += `<span>${i}</span>`;
    }
    yAxisContainer.innerHTML = yAxisHtml;

    // Build day bars
    let barsHtml = '';
    for (let day = 1; day <= daysInMonth; day++) {
      const count = dailyCounts[day] || 0;
      const heightPercent = yMax > 0 ? Math.min(100, Math.round((count / (step * 4)) * 100)) : 0;
      
      // Determine week number for color coding
      let weekNum = 1;
      let barColorClass = 'week1-fill';
      if (day <= 7) { weekNum = 1; barColorClass = 'week1-chip'; }
      else if (day <= 14) { weekNum = 2; barColorClass = 'week2-chip'; }
      else if (day <= 21) { weekNum = 3; barColorClass = 'week3-chip'; }
      else if (day <= 28) { weekNum = 4; barColorClass = 'week4-chip'; }
      else { weekNum = 5; barColorClass = 'week5-chip'; }

      const isToday = (day === todayDay);

      // Color mapping
      let barColor = 'var(--week1-accent)';
      if (weekNum === 2) barColor = 'var(--week2-accent)';
      else if (weekNum === 3) barColor = 'var(--week3-accent)';
      else if (weekNum === 4) barColor = 'var(--week4-accent)';
      else if (weekNum === 5) barColor = 'var(--week5-accent)';

      barsHtml += `
        <div class="day-bar-column ${isToday ? 'is-today' : ''}" 
             title="Day ${day}: ${count} habits completed"
             onclick="app.scrollTableToDay(${day})">
          <div class="bar-pill" style="height: ${Math.max(4, heightPercent)}%; background-color: ${barColor};"></div>
          <span class="bar-day-number">${day}</span>
        </div>
      `;
    }

    container.innerHTML = barsHtml;
  }

  /**
   * Render Category Progress Bars
   * Matches Image 2: Horizontal progress bars showing Completed vs Goal per category.
   */
  renderCategoryBars(categoryStats) {
    const container = document.getElementById('categoryBarsList');
    if (!container) return;

    if (categoryStats.length === 0) {
      container.innerHTML = `<div class="empty-state" style="text-align:center; padding: 20px; color: var(--text-muted);">No categories available</div>`;
      return;
    }

    let html = '';
    categoryStats.forEach(cat => {
      const percent = cat.goal > 0 ? Math.min(100, Math.round((cat.completed / cat.goal) * 100)) : 0;
      
      html += `
        <div class="category-progress-item">
          <div class="cat-name-badge" title="${cat.name}">
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </div>
          <div class="cat-track" title="${cat.completed} completed / ${cat.goal} goal (${percent}%)">
            <div class="cat-progress-fill" style="width: ${percent}%; background-color: ${cat.color || 'var(--accent-primary)'};"></div>
          </div>
          <div class="cat-counts-text">
            <span>${cat.completed}/${cat.goal}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
}

// Instantiate globally
window.chartEngine = new ChartEngine();
