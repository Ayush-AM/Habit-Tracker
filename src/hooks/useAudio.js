import { useState, useEffect, useRef } from 'react';

export function useAudio() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('winter_arc_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const audioCtxRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('winter_arc_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
  };

  const playCheckSound = (isChecked) => {
    if (!soundEnabled) return;
    initAudio();

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isChecked) {
      // Pleasant harmonic ascending chime (E5 -> B5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else {
      // Subtle downward tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  };

  const toggleSound = () => setSoundEnabled(prev => !prev);

  return { soundEnabled, toggleSound, playCheckSound };
}
