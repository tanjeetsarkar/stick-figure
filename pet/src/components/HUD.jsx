import { useState } from 'react';
import { createFigure } from '../figures/stickFigure.js';

const COLORS = ['#334155', '#b91c1c', '#15803d', '#1d4ed8', '#7e22ce', '#c2410c'];

export function HUD({ runningRef, figuresRef }) {
  const [paused, setPaused] = useState(false);

  function togglePause() {
    runningRef.current = !runningRef.current;
    setPaused(!runningRef.current);
  }

  function spawnFigure() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    figuresRef.current.push(
      createFigure({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight - 10,
        color,
      })
    );
  }

  return (
    <div style={hudStyle}>
      <button onClick={togglePause} style={btnStyle}>
        {paused ? 'Resume' : 'Pause'}
      </button>
      <button onClick={spawnFigure} style={btnStyle}>
        Spawn
      </button>
    </div>
  );
}

const hudStyle = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 10000,
  pointerEvents: 'auto',
  display: 'flex',
  gap: 8,
};

const btnStyle = {
  padding: '6px 14px',
  background: 'rgba(30, 30, 30, 0.85)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'system-ui, sans-serif',
};
