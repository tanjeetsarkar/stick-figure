import { useEffect, useRef, useState } from 'react';
import { createFigure } from './figures/stickFigure.js';
import { startLoop } from './canvas/loop.js';
import { listenResize } from './canvas/viewport.js';
import { HUD } from './components/HUD.jsx';

function App() {
  const canvasRef = useRef(null);
  const figuresRef = useRef([createFigure({ x: window.innerWidth / 2, y: window.innerHeight - 10 })]);
  const runningRef = useRef(true);
  const scaleRef = useRef(1);
  const strokeRef = useRef(3)
  const [scale, setScale] = useState(1);
  const [stroke, setStroke] = useState(3);

  function handleScaleChange(nextScale) {
    scaleRef.current = nextScale;
    setScale(nextScale);
  }

  const handleStrokeChange = (strokeWidth) => {
    strokeRef.current = strokeWidth;
    setStroke(strokeWidth)
  }

  useEffect(() => {
    const stopLoop = startLoop(canvasRef, figuresRef, runningRef, scaleRef, strokeRef);
    const stopResize = listenResize(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });
    return () => {
      stopLoop();
      stopResize();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <HUD
        runningRef={runningRef}
        figuresRef={figuresRef}
        scale={scale}
        onScaleChange={handleScaleChange}
        stroke={stroke}
        onStrokeChange={handleStrokeChange}
      />
    </>
  );
}

export default App;
