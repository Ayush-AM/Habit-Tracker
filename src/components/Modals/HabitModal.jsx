import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../types/habit';

export function HabitModal({
  isOpen,
  onClose,
  habitToEdit,
  onSave
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tech / Study');
  const [goal, setGoal] = useState(20);
  const [icon, setIcon] = useState('⚡');

  const popularEmojis = ['💻', '⚡', '🧠', '🛡️', '💪', '💧', '👟', '🗣️', '🎬', '📹', '🎯', '📚', '🧘', '🥗'];

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name || '');
      setCategory(habitToEdit.category || 'Tech / Study');
      setGoal(habitToEdit.goal || 20);
      setIcon(habitToEdit.icon || '⚡');
    } else {
      setName('');
      setCategory('Tech / Study');
      setGoal(20);
      setIcon('⚡');
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      category,
      goal: parseInt(goal, 10) || 20,
      icon: icon.trim() || '⚡'
    });
    onClose();
  };

  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{habitToEdit ? 'Edit Habit' : 'Add New Habit'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="modalHabitName">Habit Name *</label>
            <input
              id="modalHabitName"
              type="text"
              required
              placeholder="e.g. SQL, DSA, 3 L Water, Cyber..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modalHabitCat">Category</label>
              <select
                id="modalHabitCat"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  const matched = HABIT_CATEGORIES.find(c => c.name === e.target.value);
                  if (matched) setIcon(matched.icon);
                }}
              >
                {HABIT_CATEGORIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modalHabitGoal">Monthly Goal (Days)</label>
              <input
                id="modalHabitGoal"
                type="number"
                min="1"
                max="31"
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Emoji Icon</label>
            <div className="emoji-picker-quick">
              {popularEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-btn ${icon === emoji ? 'active' : ''}`}
                  onClick={() => setIcon(emoji)}
                >
                  {emoji}
                </button>
              ))}
              <input
                type="text"
                className="custom-emoji-input"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                title="Custom emoji or symbol"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="action-btn secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn primary-btn"
            >
              <Check size={16} />
              <span>{habitToEdit ? 'Save Changes' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
