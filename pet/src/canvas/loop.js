import { getViewport } from './viewport.js';
import { drawFigure } from './renderer.js';
import { updateFigureState } from '../figures/figureState.js';
import { updateWander } from '../behaviour/wander.js';

export function startLoop(canvasRef, figuresRef, runningRef, scaleRef, strokeRef) {
  let rafId;
  function tick() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const viewport = getViewport();
    const { w, h } = viewport;

    // Keep canvas resolution in sync with viewport
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    if (runningRef.current) {
      for (const figure of figuresRef.current) {
        updateWander(figure, viewport);
        updateFigureState(figure);
        drawFigure(ctx, figure, scaleRef.current, strokeRef.current);
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(rafId);
}
