import { useState, useEffect } from 'react';

const COLORS = ['#334155', '#b91c1c', '#15803d', '#1d4ed8', '#7e22ce', '#c2410c'];
const DEFAULTS = { enabled: true, color: '#334155', scale: 0.5, stroke: 3 };

export function Popup() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    chrome.storage.sync.get(DEFAULTS, (stored) => setSettings(stored));
  }, []);

  function update(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    chrome.storage.sync.set(patch);
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span style={titleStyle}>Stick Figure Pet</span>
        <button
          onClick={() => update({ enabled: !settings.enabled })}
          style={toggleBtnStyle(settings.enabled)}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={dividerStyle} />

      {/* Colour */}
      <div style={sectionStyle}>
        <span style={labelStyle}>Colour</span>
        <div style={swatchRowStyle}>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ color: c })}
              style={swatchStyle(c, settings.color === c)}
              title={c}
            />
          ))}
          <input
            type="color"
            value={settings.color}
            onChange={(e) => update({ color: e.target.value })}
            style={colorInputStyle}
            title="Custom colour"
          />
        </div>
      </div>

      {/* Scale */}
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Scale</span>
          <span style={valueStyle}>{settings.scale.toFixed(2)}×</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.05"
          value={settings.scale}
          onChange={(e) => update({ scale: Number(e.target.value) })}
          style={sliderStyle}
        />
      </div>

      {/* Stroke */}
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Stroke</span>
          <span style={valueStyle}>{Number(settings.stroke).toFixed(1)} px</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="8"
          step="0.05"
          value={settings.stroke}
          onChange={(e) => update({ stroke: Number(e.target.value) })}
          style={sliderStyle}
        />
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle = {
  width: 260,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: '#1e1e2e',
  color: '#cdd6f4',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 13,
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle = {
  fontWeight: 600,
  fontSize: 14,
  color: '#cdd6f4',
};

function toggleBtnStyle(enabled) {
  return {
    padding: '3px 10px',
    borderRadius: 6,
    border: 'none',
    background: enabled ? '#89b4fa' : '#45475a',
    color: enabled ? '#1e1e2e' : '#cdd6f4',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.05em',
  };
}

const dividerStyle = {
  height: 1,
  background: 'rgba(255,255,255,0.08)',
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const labelStyle = {
  fontWeight: 500,
  color: '#cdd6f4',
};

const valueStyle = {
  fontSize: 12,
  color: '#a6adc8',
};

const sliderStyle = {
  width: '100%',
  accentColor: '#89b4fa',
};

const swatchRowStyle = {
  display: 'flex',
  gap: 6,
  alignItems: 'center',
  flexWrap: 'wrap',
};

function swatchStyle(color, selected) {
  return {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: color,
    border: `2px solid ${selected ? '#cdd6f4' : 'transparent'}`,
    cursor: 'pointer',
    padding: 0,
    outline: selected ? '2px solid rgba(205,214,244,0.3)' : 'none',
    outlineOffset: 1,
  };
}

const colorInputStyle = {
  width: 28,
  height: 22,
  padding: 0,
  border: '2px solid transparent',
  borderRadius: 4,
  cursor: 'pointer',
  background: 'transparent',
};
