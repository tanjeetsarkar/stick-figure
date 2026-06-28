import { useState } from 'react';
import { createFigure } from '../figures/stickFigure.js';

const COLORS = ['#334155', '#b91c1c', '#15803d', '#1d4ed8', '#7e22ce', '#c2410c'];

export function HUD({ runningRef, figuresRef, scale, onScaleChange }) {
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

  function handleScaleInput(event) {
    onScaleChange(Number(event.target.value));
  }

  return (
    <>
      <div style={scaleModalStyle}>
        <label htmlFor="figure-scale" style={scaleLabelStyle}>
          Scale: {scale.toFixed(2)}x
        </label>
        <input
          id="figure-scale"
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={scale}
          onChange={handleScaleInput}
          style={sliderStyle}
        />
      </div>
      <div style={hudStyle}>
        <button onClick={togglePause} style={btnStyle}>
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={spawnFigure} style={btnStyle}>
          Spawn
        </button>
      </div>
    </>
  );
}

const scaleModalStyle = {
  position: 'fixed',
  top: 20,
  left: 20,
  zIndex: 10000,
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minWidth: 220,
  padding: '10px 12px',
  background: 'rgba(30, 30, 30, 0.85)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 10,
  backdropFilter: 'blur(4px)',
};

const scaleLabelStyle = {
  color: '#fff',
  fontSize: 13,
  fontFamily: 'system-ui, sans-serif',
};

const sliderStyle = {
  width: '100%',
};

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
