import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../types/habit';
import { HabitIcon, POPULAR_PROFESSIONAL_ICONS } from '../Common/HabitIcon';

export function HabitModal({
  isOpen,
  onClose,
  habitToEdit,
  onSave
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tech / Study');
  const [goal, setGoal] = useState(20);
  const [icon, setIcon] = useState('Database');

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name || '');
      setCategory(habitToEdit.category || 'Tech / Study');
      setGoal(habitToEdit.goal || 20);
      setIcon(habitToEdit.icon || 'Database');
    } else {
      setName('');
      setCategory('Tech / Study');
      setGoal(20);
      setIcon('Database');
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
      icon: icon || 'Database'
    });
    onClose();
  };

  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-header-icon">
              <HabitIcon name={icon} size={18} />
            </span>
            <h3>{habitToEdit ? 'Edit Habit' : 'Add New Habit'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
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
              placeholder="e.g. SQL, DSA, 3 L Water, Cyber, Open Source..."
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
                  if (matched && matched.icon) setIcon(matched.icon);
                }}
              >
                {HABIT_CATEGORIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name}
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

          {/* Professional Icon Picker */}
          <div className="form-group">
            <div className="icon-picker-label-row">
              <label>Professional Icon</label>
              <span className="selected-icon-badge">
                Selected: <HabitIcon name={icon} size={13} /> <strong>{icon}</strong>
              </span>
            </div>

            <div className="pro-icon-picker-grid">
              {POPULAR_PROFESSIONAL_ICONS.map(item => {
                const isSelected = (icon.toLowerCase() === item.key.toLowerCase());
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`pro-icon-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setIcon(item.key)}
                    title={item.name}
                  >
                    <HabitIcon name={item.key} size={18} />
                    <span className="pro-icon-name">{item.key}</span>
                  </button>
                );
              })}
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

export default HabitModal;
