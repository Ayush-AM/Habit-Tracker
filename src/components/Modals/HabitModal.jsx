import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Minus, Plus } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../types/habit';
import { HabitIcon, POPULAR_PROFESSIONAL_ICONS } from '../Common/HabitIcon';

export function HabitModal({
  isOpen,
  onClose,
  habitToEdit,
  onSave,
  onDelete
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
      goal: Math.max(1, Math.min(31, parseInt(goal, 10) || 20)),
      icon: icon || 'Database'
    });
    onClose();
  };

  const handleAdjustGoal = (delta) => {
    setGoal(prev => Math.max(1, Math.min(31, (parseInt(prev, 10) || 20) + delta)));
  };

  const handleDelete = () => {
    if (!habitToEdit || !onDelete) return;
    const result = onDelete(habitToEdit.id);
    if (result !== false) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal-card habit-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-header-icon">
              <HabitIcon name={icon} size={20} />
            </span>
            <div>
              <h3>{habitToEdit ? 'Edit Habit' : 'Add New Habit'}</h3>
              <span className="modal-header-sub">
                {habitToEdit ? `Updating "${habitToEdit.name}"` : 'Add a new habit to track'}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Habit Name */}
          <div className="form-group">
            <label htmlFor="modalHabitName" className="form-label">
              Habit Name *
            </label>
            <input
              id="modalHabitName"
              type="text"
              required
              className="modal-input"
              placeholder="e.g. SQL, DSA, 3 L Water, Gym, Reading..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Category & Goal Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="modalHabitCat" className="form-label">
                Category
              </label>
              <select
                id="modalHabitCat"
                className="modal-select"
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

            <div className="form-group flex-1">
              <label htmlFor="modalHabitGoal" className="form-label">
                Monthly Goal (Days)
              </label>
              <div className="goal-stepper-wrap">
                <button 
                  type="button" 
                  className="goal-step-btn" 
                  onClick={() => handleAdjustGoal(-1)}
                  aria-label="Decrease goal"
                >
                  <Minus size={14} />
                </button>
                <input
                  id="modalHabitGoal"
                  type="number"
                  min="1"
                  max="31"
                  required
                  className="modal-input goal-stepper-input"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
                <button 
                  type="button" 
                  className="goal-step-btn" 
                  onClick={() => handleAdjustGoal(1)}
                  aria-label="Increase goal"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Professional Icon Picker */}
          <div className="form-group">
            <div className="icon-picker-label-row">
              <label className="form-label">Icon</label>
              <span className="selected-icon-badge">
                Selected: <HabitIcon name={icon} size={14} /> <strong>{icon}</strong>
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
                    <HabitIcon name={item.key} size={20} />
                    <span className="pro-icon-name">{item.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="modal-actions-bar">
            {habitToEdit && onDelete ? (
              <button
                type="button"
                className="action-btn danger-delete-btn"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                <span>Delete Habit</span>
              </button>
            ) : <div />}

            <div className="modal-actions-right">
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitModal;
