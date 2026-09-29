import React, { useState } from 'react';
import { Sparkles, Dices, Quote } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../types/habit';

export function QuoteCard() {
  const [index, setIndex] = useState(0);

  const current = MOTIVATIONAL_QUOTES[index % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="extra-card quote-card">
      <div className="quote-content">
        <Quote size={28} className="quote-icon" />
        <p className="quote-text">"{current.quote}"</p>
        <span className="quote-author">— {current.author}</span>
      </div>

      <button
        onClick={() => setIndex(prev => prev + 1)}
        className="pill-btn subtle-pill"
        title="Next motivational thought"
      >
        <Dices size={14} />
        <span>Next Motivation</span>
      </button>
    </div>
  );
}
