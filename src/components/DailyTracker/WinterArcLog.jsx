import React, { useState } from 'react';
import { Footprints, Droplets, Clock, Video, Send } from 'lucide-react';

export function WinterArcLog({
  dailyMetrics,
  persistDailyMetrics,
  todayDayNumber,
  onNotify
}) {
  const [noteText, setNoteText] = useState(() => {
    const today = todayDayNumber || 1;
    return (dailyMetrics.notes && dailyMetrics.notes[today]) || '';
  });

  const handleAdjustMetric = (key, delta) => {
    const current = dailyMetrics[key] || 0;
    const updated = Math.max(0, Math.round((current + delta) * 10) / 10);
    persistDailyMetrics({
      ...dailyMetrics,
      [key]: updated
    });
  };

  const handleSaveNote = () => {
    const today = todayDayNumber || 1;
    const updatedNotes = { ...(dailyMetrics.notes || {}), [today]: noteText.trim() };
    persistDailyMetrics({
      ...dailyMetrics,
      notes: updatedNotes
    });
    if (onNotify) onNotify("Winter Arc focus note saved and auto-synced.");
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="extra-card timelapse-card">
      <div className="extra-card-header">
        <div className="extra-header-title">
          <Video size={16} className="text-primary" />
          <h4>Winter Arc Daily Reflection & Timelog</h4>
        </div>
        <div className="header-badges-row">
          <span className="timestamp-badge">Today: {todayStr}</span>
        </div>
      </div>

      <div className="daily-log-form">
        <div className="quick-counter-grid">
          {/* Steps */}
          <div className="counter-box">
            <div className="counter-icon-wrap bg-emerald-50 text-emerald-600">
              <Footprints size={20} />
            </div>
            <div className="counter-info">
              <span className="counter-title">Daily Steps</span>
              <div className="counter-controls">
                <button 
                  className="cnt-btn" 
                  onClick={() => handleAdjustMetric('steps', -1000)}
                >
                  -
                </button>
                <span className="counter-val">{(dailyMetrics.steps || 8000).toLocaleString()}</span>
                <button 
                  className="cnt-btn" 
                  onClick={() => handleAdjustMetric('steps', 1000)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Water */}
          <div className="counter-box">
            <div className="counter-icon-wrap bg-cyan-50 text-cyan-600">
              <Droplets size={20} />
            </div>
            <div className="counter-info">
              <span className="counter-title">Water Intake</span>
              <div className="counter-controls">
                <button 
                  className="cnt-btn" 
                  onClick={() => handleAdjustMetric('water', -0.5)}
                >
                  -
                </button>
                <span className="counter-val">{dailyMetrics.water || 3.0} L</span>
                <button 
                  className="cnt-btn" 
                  onClick={() => handleAdjustMetric('water', 0.5)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Deep Work */}
          <div className="counter-box">
            <div className="counter-icon-wrap bg-violet-50 text-violet-600">
              <Clock size={20} />
            </div>
            <div className="counter-info">
              <span className="counter-title">Deep Work</span>
              <div className="counter-controls">
                <button 
                  className="cnt-btn" 
                  onClick={() => handleAdjustMetric('deepWork', -0.5)}
                >
                  -
                </button>
                <span className="counter-val">{dailyMetrics.deepWork || 4.0} hrs</span>
                <button 
                  className="cnt-btn" 
                  onClick={() => handleAdjustMetric('deepWork', 0.5)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timelapse & Focus Notes */}
        <div className="notes-entry-box">
          <label className="notes-label">
            Focus Reflection & Timelapse Video Link
          </label>
          <div className="notes-input-wrap">
            <input
              type="text"
              className="notes-input"
              placeholder="Log today's focus, git commits, or timelapses..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote();
              }}
            />
            <button
              onClick={handleSaveNote}
              className="notes-save-btn"
              title="Save reflection to cloud"
            >
              <Send size={15} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WinterArcLog;
