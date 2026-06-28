import { createFigure } from '../../pet/src/figures/stickFigure.js';
import { startLoop } from '../../pet/src/canvas/loop.js';

// ─── State ────────────────────────────────────────────────────────────────────

const DEFAULTS = { enabled: true, color: '#334155', scale: 0.5, stroke: 3 };

let canvas = null;
let stopLoop = null;

// Plain ref-like objects that startLoop understands — no React required.
const canvasRef  = { current: null };
const figuresRef = { current: [] };
const runningRef = { current: true };
const scaleRef   = { current: DEFAULTS.scale };
const strokeRef  = { current: DEFAULTS.stroke };

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function buildCanvas() {
  const el = document.createElement('canvas');
  el.id = 'stick-figure-pet-canvas';
  el.width  = window.innerWidth;
  el.height = window.innerHeight;
  Object.assign(el.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100vw',
    height:        '100vh',
    pointerEvents: 'none',
    zIndex:        '2147483647',
  });
  return el;
}

function inject(settings) {
  if (canvas) return; // guard against double-injection

  canvas = buildCanvas();
  canvasRef.current = canvas;

  scaleRef.current  = settings.scale;
  strokeRef.current = settings.stroke;
  runningRef.current = true;

  figuresRef.current = [
    createFigure({
      x:     window.innerWidth / 2,
      y:     window.innerHeight - 10,
      color: settings.color,
    }),
  ];

  document.body.appendChild(canvas);
  stopLoop = startLoop(canvasRef, figuresRef, runningRef, scaleRef, strokeRef);
}

function eject() {
  if (stopLoop) { stopLoop(); stopLoop = null; }
  if (canvas)   { canvas.remove(); canvas = null; canvasRef.current = null; }
  figuresRef.current = [];
}

// ─── SPA navigation — reset figure position on client-side route changes ──────

function onNavigate() {
  for (const fig of figuresRef.current) {
    fig.x = window.innerWidth / 2;
  }
}

window.addEventListener('popstate', onNavigate);

// Patch history.pushState so SPA push-navigation also triggers a reset.
const _pushState = history.pushState.bind(history);
history.pushState = (...args) => {
  _pushState(...args);
  onNavigate();
};

// ─── Live settings sync ───────────────────────────────────────────────────────

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    if (changes.enabled.newValue) {
      chrome.storage.sync.get(DEFAULTS, inject);
    } else {
      eject();
    }
  }
  if (changes.color && figuresRef.current.length > 0) {
    figuresRef.current[0].color = changes.color.newValue;
  }
  if (changes.scale) {
    scaleRef.current = changes.scale.newValue;
  }
  if (changes.stroke) {
    strokeRef.current = changes.stroke.newValue;
  }
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

chrome.storage.sync.get(DEFAULTS, (settings) => {
  if (settings.enabled) {
    inject(settings);
  }
});
